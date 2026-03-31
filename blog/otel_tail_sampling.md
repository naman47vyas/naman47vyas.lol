---
layout: post
title: "OTel Tail Sampling: From Single Collector to Multi-Layer Architecture"
date: 2026-03-31
permalink: /blog/otel-tail-sampling/
---
## What Problem Sampling Solves:

We cannot store every trace. We cannot also loose interesting traces either. A trace of interest being the ones with above accepted latency or with non 2xx status codes. So we need to decide what traces to store and drop.

Depending on at what point in time the decision to store of drop a trace: there are two widely used approaches for sampling i.e. HEAD and TAIL sampling.


### Head Sampling:

The decision take place upfront, usually at the root span, before we know anything about what the trace is gonna be like.

A 10% head sample means we keep 10% of everything: the boring 200 OKs, the fast cache hits, but also only 10% of the errors and only 10% of the slow requests. The signal(interesting traces) gets diluted along with the noise(2xx and normal latencied).

### Tail Sampling:

Tail sampling flips this. Instead of deciding at the start, we wait for the trace to complete (or at least for enough of it to arrive), look at the whole picture, and _then_ decide whether to keep it.

So now we can say things like: "keep 100% of errors, keep everything slower than 500ms, and randomly sample 5% of the rest." The interesting stuff survives, the repetitive healthy traffic gets dropped, and our storage bill goes down without losing debugging capability.

#### Trade-off:
If you see we'll need all the spans with us in memory, to make this sorting. Something has to sit in the middle and hold onto traces in memory while waiting for spans to arrive.

That "something" in the OTel world is the [tail sampling processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/tailsamplingprocessor) — it lives in `opentelemetry-collector-contrib`, not the core collector. The key files worth looking at:

- [`processor.go`](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/tailsamplingprocessor/processor.go) — the main processing loop. This is where spans get grouped by trace ID, buffered, and where the decision timer fires. It pulls from an `idbatcher` (basically a channel of trace ID batches) and evaluates policies against the accumulated spans.
- [`config.go`](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/tailsamplingprocessor/config.go) — the `Config` struct that maps to the YAML. Worth reading because the Go comments are more descriptive than the docs in some cases. For example, the `NumTraces` field comment says _"Typically most of the data of a trace is released after a sampling decision is taken"_ — which tells you the circular buffer evicts trace data after decisions, not just on overflow.
- [`internal/idbatcher/`](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/tailsamplingprocessor/internal/idbatcher) — the batching mechanism that groups trace IDs into time-based batches for evaluation. This is what ties `decision_wait` to the actual evaluation cycle.
- [`internal/sampling/`](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/tailsamplingprocessor/internal/sampling) — where the individual policy evaluators live (latency, status_code, etc.). Each one implements a `ShouldSample` method.


That's the idea. The devil is in the implementation details. How it buffers, how it decides when a trace is "DONE," how it handles scale, and where it breaks. That's what the rest of this doc digs into.




# Scenario 1: Tail Sampling at Small/Medium Scale (Single Collector)

At small-to-medium scale, the setup is fairly simple. We run one OTel Collector (the contrib distro, since the tail sampling processor lives there), all services send their spans to it, and it buffers traces in memory, evaluates policies, and exports what survives.

Here's a realistic config for a team running maybe 10-15 microservices doing a few hundred traces/sec:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  memory_limiter:
    check_interval: 1s
    limit_mib: 3000
    spike_limit_mib: 800

  tail_sampling:
    decision_wait: 10s
    num_traces: 100000
    expected_new_traces_per_sec: 500

    policies:
      - name: errors-policy
        type: status_code
        status_code:
          status_codes: [ERROR]

      - name: latency-policy
        type: latency
        latency:
          threshold_ms: 500

      - name: canary-service
        type: string_attribute
        string_attribute:
          key: service.name
          values: ["payment-service-v2"]

      - name: probabilistic-baseline
        type: probabilistic
        probabilistic:
          sampling_percentage: 5

  batch:
    send_batch_size: 2000
    timeout: 1s

exporters:
  otlphttp:
    endpoint: "https://your-backend.example.com:4318"

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, tail_sampling, batch]
      exporters: [otlphttp]
```

A simple walk-through through this config.

#### How the processor actually works internally?

When a span arrives, the processor reads the trace ID and puts it into an internal map. It keeps accumulating spans for that trace until `decision_wait` expires (10 seconds here, counted from when the _first_ span of that trace arrived). After that window closes, it evaluates all the policies against the collected spans. If _any_ policy votes "sample," the whole trace gets kept. If nothing matches, the trace is dropped.

Note:
The important thing to understand is that `decision_wait` is a dumb timer — there's no "all spans have arrived" detection. So for example: We have a service that fires off an async Kafka producer span 12 seconds after the root span, that span will arrive _after_ the decision was already made. The processor tracks these as "late spans" and you can watch for them via `otelcol_processor_tail_sampling_sampling_late_span_age`. If the trace was already sampled, the late span gets included. If it was dropped, the late span is also dropped.

Another Note:

The order in the pipeline config matters more than you'd expect:

1. **`memory_limiter` must come before `tail_sampling`.** The tail sampling processor is the hungriest thing in your pipeline. If you don't put the memory limiter in front, a traffic spike can OOM the collector before the limiter even kicks in.
2. **`k8sattributes` (or any context-dependent processor) must come before `tail_sampling`.** The tail sampling processor reassembles spans into new batches when it exports them, and in doing so it loses the original batch context. So if k8sattributes hasn't already enriched the spans, it won't be able to after tail sampling.
3. **Never put `batch` before `tail_sampling`.** The batch processor groups spans into batches for efficiency, but it doesn't care about trace IDs. So it can split spans from the same trace into different batches, which means the tail sampling processor might evaluate a trace before all its spans have arrived within the same batch cycle. Put `batch` _after_.


#### What's in the policy toolbox

There are roughly 13 policy types. I won't list them all, but the ones worth knowing about:

**The bread and butter:**

- `status_code` — keep all errors. This is the one everyone starts with.
- `latency` — keep traces above a threshold. One gotcha: it calculates duration as `(latest_end_time - earliest_start_time)`, which means async child spans can inflate the duration. Say you have a 50ms HTTP request that fires a Kafka produce span that takes 2 seconds — that trace now has a 2 second "latency" even though the user saw 50ms.
- `probabilistic` — random sampling by percentage. Uses trace ID for determinism.

**The interesting ones:**

- `ottl_condition` — this is where it gets powerful. You can write OTTL (OpenTelemetry Transformation Language) expressions that query span and span event properties directly. Example: you could write a condition that matches traces where any span has `db.statement` containing "SELECT" and `db.duration` > 100ms. The fact that a dedicated tool called OTail emerged just to help people configure this processor tells you something about both its flexibility and its complexity.
- `composite` — lets you set a total spans/sec budget and allocate percentages to sub-policies. Example:

yaml

```yaml
- name: budget-policy
  type: composite
  composite:
    max_total_spans_per_second: 1000
    policy_order: [errors, slow, baseline]
    composite_sub_policy:
      - name: errors
        type: status_code
        status_code:
          status_codes: [ERROR]
      - name: slow
        type: latency
        latency:
          threshold_ms: 500
      - name: baseline
        type: probabilistic
        probabilistic:
          sampling_percentage: 10
    rate_allocation:
      - policy: errors
        percent: 50
      - policy: slow
        percent: 30
      - policy: baseline
        percent: 20
```

This says: "I want at most 1000 spans/sec total. Give 50% of that budget to errors, 30% to slow traces, 20% to random baseline." Useful when you need predictable output volume for cost control.

- `bytes_limiting` — newer addition, uses a token bucket algorithm to limit throughput by bytes/sec instead of trace count. Handy when you have wildly varying trace sizes and counting traces doesn't give you predictable memory/bandwidth usage.
- `and` — compose multiple conditions. Example: "sample 1% of traces where `service.name` = `noisy-health-check` AND `status_code` != ERROR." This is how you do differential sampling rates per service.

#### Sizing `num_traces` and `decision_wait`

`num_traces` is a circular buffer. When it fills up, the oldest trace gets evicted _before_ a sampling decision is made — which means data loss. The metric `otelcol_processor_tail_sampling_sampling_trace_dropped_too_early` tells you when this is happening.

The sizing math is straightforward:

```
num_traces >= traces_per_sec × decision_wait × safety_factor

Example:
  500 traces/sec × 10s decision_wait × 1.5 safety = 7,500 traces minimum
```

For memory estimation:

```
buffer_memory ≈ avg_trace_size × num_traces

Example:
  10KB avg trace × 100,000 num_traces = ~1GB
  (plus 20-30% overhead for the processor's internal data structures)
```

AWS's documentation suggests a concrete rule of thumb: if your max expected request latency is 10 seconds and max throughput is 1000 req/s, set `decision_wait: 10s` and `num_traces: 10000` at minimum. I'd add a 1.5-2x safety margin on top of that.


#### Sizing other config params:

**maximum_trace_size_bytes**:
A newer safety valve. It drops oversized traces immediately to protect the system. Useful if you have runaway instrumentation producing abnormally large traces.

**sample_on_first_match**:
Short-circuits policy evaluation as soon as one policy matches. Can reduce CPU usage when you have many policies.


#### Metrics to watch

Three metrics that tell you if the processor is healthy or struggling:

- **`otelcol_processor_tail_sampling_sampling_trace_dropped_too_early`** — Non-zero means `num_traces` is too small. You're losing data before it can be evaluated. This is the most critical one.
- **`otelcol_processor_tail_sampling_sampling_trace_removal_age`** — This is a histogram of how long traces stay in the buffer. Compare the p1 (1st percentile) to your `decision_wait`. If they're close, you're on the edge — a small traffic increase will start causing drops.
- **`otelcol_processor_tail_sampling_sampling_late_span_age`** — Histogram of how late the late spans are arriving. If you see a big chunk of late spans, either increase `decision_wait` (costs memory) or accept that those async spans won't influence sampling decisions.

You can also calculate the percentage of late spans with:

```
late_span_ratio = late_span_age{le="+Inf"} / count_spans_sampled
```

(Note: `count_spans_sampled` requires enabling the `processor.tailsamplingprocessor.metricstatcountspanssampled` feature gate.)


# Scenario 2: Tail Sampling at Scale (Multi-Collector)

At some point the single collector setup from Scenario 1 hits a wall. You'll see `sampling_trace_dropped_too_early` climbing, memory usage creeping toward the limit, and you'll realize you can't just keep cranking up `num_traces` forever. Time to scale horizontally.

We can work backwards from the math to give ballpark numbers.

Say you're running a collector with 4GB of memory (a reasonable K8s pod limit). The memory limiter takes some, the Go runtime takes some, so realistically you've got maybe 2.5-3GB for the tail sampling buffer. With average trace sizes:

**Small traces (~5KB avg, simple services)**:
3GB / 5KB = ~600,000 traces in buffer. At decision_wait: 10s, that supports roughly 60,000 traces/sec before you start hitting trace_dropped_too_early. Most teams won't hit this.

**Medium traces (~50KB avg, 20-30 spans per trace, typical microservice):**
3GB / 50KB = ~60,000 traces. At 10s decision_wait, that's about 6,000 traces/sec. This is where mid-size companies start feeling pain.


**Large traces (~200KB avg, deep call graphs, lots of attributes)**:
3GB / 200KB = ~15,000 traces. At 10s decision_wait, that's roughly 1,500 traces/sec. You'll hit the wall fast.

You cannot really keep scaling a single collector vertically. So we spin up multiple collector instances with a load balancer.

A fundamental constraint comes with tail sampling:

**ALL SPANS FOR A GIVEN TRACE MUST COME TO THE SAME COLLECTOR INSTANCE**


For example:

If trace `abc123` has spans from `service-A`, `service-B`, and `service-C`, and those spans get scattered across three different sampling collectors, each collector only sees a fragment of the trace. Your latency policy might miss the slow span, your error policy might miss the error span, and you end up with broken sampling decisions.

You can't just put a regular round-robin load balancer in front of multiple collectors and call it a day. You need trace-ID-aware routing. And this is where the two-layer architecture comes in.


The idea:
```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Service A  │  │  Service B  │  │  Service C  │
│  (OTel SDK) │  │  (OTel SDK) │  │  (OTel SDK) │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │
       │     OTLP/gRPC or HTTP           │
       ▼                ▼                ▼
┌──────────────────────────────────────────────┐
│         LAYER 1: Load Balancing              │
│     (DaemonSet or Deployment in K8s)         │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Collector│  │ Collector│  │ Collector│    │
│  │  Agent 1 │  │  Agent 2 │  │  Agent 3 │    │
│  │          │  │          │  │          │    |
│  │ loadbal- │  │ loadbal- │  │ loadbal- │    │
│  │ ancing   │  │ ancing   │  │ ancing   │    │
│  │ exporter │  │ exporter │  │ exporter │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│       │             │             │          │
└───────┼─────────────┼─────────────┼────────--┘
        │   Route by  │   trace ID │
        ▼              ▼            ▼
┌──────────────────────────────────────────────┐
│        LAYER 2: Tail Sampling                │
│     (StatefulSet in K8s - headless svc)      │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Sampling │  │ Sampling │  │ Sampling │    │
│  │Collector │  │Collector │  │Collector │    │
│  │    1     │  │    2     │  │    3     │    │
│  │          │  │          │  │          │    │
│  │  tail_   │  │  tail_   │  │  tail_   │    │
│  │ sampling │  │ sampling │  │ sampling │    │
│  │processor │  │processor │  │processor │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│       │              │              │        │
└───────┼──────────────┼──────────────┼────────┘
        │              │              │
        ▼              ▼              ▼
┌──────────────────────────────────────────────┐
│            Backend (Jaeger/Tempo/etc.)       │
└──────────────────────────────────────────────┘
```


The OTel docs explicitly [recommend](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/tailsamplingprocessor/README.md#scaling-collectors-with-the-tail-sampling-processor) separating these into two distinct deployments rather than running two pipelines on one instance. The reasoning is tightening the blast radius. The Layer 1 collectors are stateless and cheap, Layer 2 collectors are stateful and memory-hungry. They have completely different resource profiles and scaling characteristics. Mixing them on one instance means a memory spike from tail sampling takes down your routing too.


#### Layer1: Load balancing collectors:
This collector does almost nothing: receive spans, hash the trace ID, forward to the right Layer 2 pod. No processing, no enrichment, no batching.

layer1-loadbalancer.yaml
```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

exporters:
  loadbalancing:
    routing_key: "traceID"
    protocol:
      otlp:
        timeout: 1s
        tls:
          insecure: true
    resolver:
      # Option 1: DNS resolver — resolves a K8s headless service
      dns:
        hostname: otel-sampler-headless.observability.svc.cluster.local
        port: 4317

      # Option 2: K8s resolver — watches the API server for pod changes
      # Faster reaction to scaling events than DNS polling
      # k8s:
      #   service: otel-sampler-headless.observability
      #   ports:
      #     - 4317

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: []
      exporters: [loadbalancing]
```

#### How this load balancing works?

It creates one OTLP sub-exporter per discovered backend endpoint. When a span arrives, it hashes the trace ID and uses consistent hashing to pick which sub-exporter (and therefore which backend) gets the span. The hash distribution is pretty even. The docs claim standard deviation under 5% across backends.


**resolver-options**:

**`static`** — hardcoded list of IPs/hostnames. Simple, but you have to update config and restart when backends change. Fine for non-K8s or testing.

**`dns`** — resolves a hostname (typically a K8s headless service) to a list of IPs. Polls periodically (default every 5 seconds). This means there's up to a 5-second window where the load balancer's view of backends is stale after a scaling event. If you have multiple Layer 1 collectors, each one runs its own DNS poll independently, so for up to ~10 seconds two load balancers might disagree about where to send spans for the same trace ID. That's a window where trace fragments can happen.

**`k8s`** — watches the Kubernetes API server for EndpointSlice changes. Faster reaction time than DNS polling. But it requires RBAC permissions:

```yaml
# The K8s resolver needs these permissions
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: otel-lb-role
  namespace: observability
rules:
  - apiGroups: ["discovery.k8s.io"]
    resources: ["endpointslices"]
    verbs: ["list", "watch", "get"]
```


**Important default that catches people off guard:** the load balancing exporter will NOT attempt to re-route data to a healthy endpoint on delivery failure by default. The `in-memory queue`, `retry`, and `timeout` settings at the loadbalancer level are disabled out of the box. If a Layer 2 pod goes down and the resolver hasn't caught up yet, spans going to that pod are JUST LOST. To fix this, enable the retry/queue settings at the loadbalancer level:

```yaml
exporters:
  loadbalancing:
    routing_key: "traceID"
    # Enable retries at the LB level for resilience during scaling events
    retry_on_failure:
      enabled: true
      initial_interval: 5s
      max_interval: 30s
      max_elapsed_time: 300s
    sending_queue:
      enabled: true
      num_consumers: 2
      queue_size: 1000
    protocol:
      otlp:
        timeout: 1s
        tls:
          insecure: true
    resolver:
      dns:
        hostname: otel-sampler-headless.observability.svc.cluster.local
        port: 4317
```


#### Layer2: the sampling collectors

These are basically our workhorses. Same tail sampling config from Scenario 1, but now each one handles a fraction of the total trace volume.


```yaml
# layer2-sampler.yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317

processors:
  memory_limiter:
    check_interval: 1s
    limit_mib: 4000
    spike_limit_mib: 1000

  tail_sampling:
    decision_wait: 10s
    num_traces: 200000
    expected_new_traces_per_sec: 2000
    decision_cache:
      sampled_cache_size: 500000
      non_sampled_cache_size: 500000
    policies:
      - name: errors
        type: status_code
        status_code:
          status_codes: [ERROR]
      - name: high-latency
        type: latency
        latency:
          threshold_ms: 500
      - name: baseline
        type: probabilistic
        probabilistic:
          sampling_percentage: 5

  batch:
    send_batch_size: 2000
    timeout: 1s

exporters:
  otlphttp:
    endpoint: "https://tempo-jaeger-clickhouse.your-backend.com:4318"

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, tail_sampling, batch]
      exporters: [otlphttp]
```


#### How this maps to Kubernetes?

##### Layer 2 (sampling collectors) should be a StatefulSet behind a headless Service (clusterIP: None).

Two reasons:
First, the headless service is what the DNS or k8s resolver on Layer 1 discovers. It returns individual pod IPs instead of a single virtual IP, which is what the load balancing exporter needs to build its hash ring.

Second, StatefulSets give you stable pod identities (otel-sampler-0, otel-sampler-1, etc.) and ordered scaling. When you scale from 3 to 4 pods, the existing pods keep their names and don't restart. With a Deployment, a rolling update can restart all pods at once, which means all buffered traces across the entire sampling layer are lost simultaneously.

Resource-wise, these are the hungry pods — think 4-6Gi memory, 1-2 CPU.

##### Layer 1 (routing collectors) is just a regular Deployment behind a normal ClusterIP Service.

These are stateless and lightweight (~256-512Mi memory), so you can scale them freely, roll them, auto-scale them. None of that affects sampling correctness. Your services point their OTLP exporters at this service (otel-gateway.observability.svc.cluster.local:4317), Kubernetes round-robins across the Layer 1 pods, and each Layer 1 pod consistently hashes and routes to the correct Layer 2 pod. If you're using the k8s resolver, the Layer 1 pods need a ServiceAccount with RBAC permissions to list, watch, and get EndpointSlices in the observability namespace.

#### What actually happens during a scaling event:


This is where things get real. Let's say you scale Layer 2 from 3 pods to 4. Here's the timeline:

1. **T=0:** New pod `otel-sampler-3` starts, registers in the headless service.
2. **T=0 to T=~5s (DNS) or T=~1s (k8s resolver):** Layer 1 collectors don't know about the new pod yet. They're still hashing to 3 backends.
3. **T=5s:** First Layer 1 collector's DNS resolves, sees 4 backends. The consistent hash ring changes. Roughly 25% of trace IDs now map to a different backend than before. Any trace that was in-flight i.e. some spans already on `otel-sampler-1`, new spans now routing to `otel-sampler-3` are now fragmented.
4. **T=5-10s:** Other Layer 1 collectors resolve DNS at different times. During this window, different Layer 1 collectors disagree about where to send the same trace ID. More fragmentation.
5. **T=10s+:** All Layer 1 collectors have converged on the same view. New traces are fine. But any trace that was active during the transition window may have incomplete data on whichever collector it landed on.


There are no consistency guarantees. The OTel maintainers have explicitly said this — from [a GitHub discussion](https://github.com/open-telemetry/opentelemetry-collector-contrib/issues/13635) on the topic: _"Right now, there are no consistency guarantees, as it would require a complexity that might not be warranted."_

In practice, this means: **don't auto-scale the Layer 2 StatefulSet.** Scale it manually, during low-traffic windows if possible, and accept that a small percentage of traces during the transition will have incomplete sampling decisions.


So in conclusion:

#### **What works well:**

- The load balancing exporter is hash-consistent and achieves reasonable distribution (~5% std dev). It's not fancy but it gets the job done.
- Separating layers gives real failure isolation. A Layer 2 collector OOMing doesn't take down span ingestion.
- The k8s resolver is a meaningful improvement over DNS for reaction time to topology changes.


#### What does not work well:

- **Still fully in-memory.** Scaling horizontally doesn't change the fundamental limitation. Each Layer 2 collector is holding traces in RAM. If a pod crashes or gets OOM-killed, every buffered trace on that pod is gone. No WAL, no disk spillover, no external state store.

- **Scaling the sampling layer is fragile.** As described above, any change to the number of Layer 2 pods causes a hash ring reshuffle and temporary trace fragmentation. This makes auto-scaling effectively unusable for Layer 2. You can auto-scale Layer 1 all day (stateless), but Layer 2 needs careful, manual management.

- **Double network hop.** Every span now makes two hops: service → Layer 1 → Layer 2 → backend. That's added latency and more points of failure. At high throughput, the Layer 1 → Layer 2 hop can become a bottleneck, especially if TLS is enabled.

- **Operational complexity.** You're now managing two separate collector deployments with different configs, different resource profiles, different scaling characteristics, different failure modes. The configs need to stay in sync (e.g., if you add a new Layer 2 pod, DNS needs to reflect it). In Kubernetes this is manageable but it's still more stuff to get wrong.

- **Memory math doesn't fundamentally change.** With 3 Layer 2 collectors each handling 1/3 of traces, each one needs `num_traces` sized for 1/3 of your total volume. But you're also paying the overhead of 3 separate collector processes, 3 separate memory limiters, 3 separate OTLP connection pools. The total cluster memory is higher than a single collector would need for the same volume, because of the per-process overhead.

- **No back-pressure from Layer 2 to Layer 1.** If a Layer 2 collector is struggling (high memory, slow policy evaluation), there's no signal back to the Layer 1 collectors to slow down or redistribute. The load balancing exporter will keep hammering the same backend based on the hash, even if that backend is overloaded. The `otelcol_loadbalancer_backend_latency` metric can help you spot this, but there's no automatic remediation.


#### Metrics to watch for the two-layer setup

In addition to the per-collector metrics from Section 1, add these:

**On Layer 1 collectors:**

- `otelcol_loadbalancer_num_backends` — how many Layer 2 backends are discovered. If this drops, you have a discovery problem.
- `otelcol_loadbalancer_backend_latency` — latency per backend. If one backend is consistently slower, it might be overloaded or have a larger share of "heavy" traces.
- `otelcol_exporter_queue_size` vs `otelcol_exporter_queue_capacity` — if the queue starts filling up, Layer 2 can't keep up. Scale up Layer 2 or investigate what's slow.
- `otelcol_exporter_enqueue_failed_spans` — non-zero means the queue is full and spans are being dropped before they even reach Layer 2.

**On Layer 2 collectors:**

- All the same tail sampling metrics from Scenario 1 (`trace_dropped_too_early`, `trace_removal_age`, `late_span_age`, `decision_timer_latency`), but now per-pod. Alert if any single pod starts diverging significantly from the others — that could indicate uneven hash distribution or a hot trace ID.
