---
layout: post
title: "How to Write a Custom OpenTelemetry Exporter"
date: 2025-02-03
---
# How to write a custom exporter? Example: Dummy Console Logger exporter.

Our exporter live inside the `open-telemetry/opentelemetry-collector-contrib` repository. This repo contains many exporters, receivers and processors. 

So lets create our own `consolelogexporter`, inside the `exporter` directory.

```bash
git clone https://github.com/open-telemetry/opentelemetry-collector-contrib.git
cd opentelemetry-collector-contrib
mkdir exporter/consolelogexporter
cd exporter/consolelogexporter
```

## Identity and otel's `metadata.yaml` system.

Every component in otel (receiver, processor, exporter) needs a name, stability and ownership details. This is defined in a `metadata.yaml` file.
```yaml
type: consolelogexporter  # The name users wil write in the otel-config.yaml
scope_name: otelcol/consolelogexporter

status:
  class: exporter
  stability:
    beta: [logs]
  distributions: [contrib]
  codeowners:
    active: [vyasn30]
```
 
There are many metadata structs and functions that will be used in further development. Otel takes care of these by generating those golang files for you by using `mdatagen`. 

#### Triggering Generation
A `doc.go` file contains the generate directive:

```go
package consolelogexporter 
```

When you run go generate ./..., Go finds this directive and executes mdatagen metadata.yaml. The mdatagen tool reads your YAML and produces Go code.

This is situated at `internal/metadata/generated_status.go`

```go
package metadata

import "go.opentelemetry.io/collector/component"

var (
    Type      = component.MustNewType("sqliteexporter")
    ScopeName = "otelcol/sqliteexporter"
)

const (
    LogsStability = component.StabilityLevelBeta
)
```

An exporter has 3 jobs:
```
Configure → What settings does the user provide? (config.go)
Create → How do we build an instance? (factory.go)
Export → What do we do with the data? (exporter.go)
```

## Configuration 

This is where we define the configuration options for our exporter. If you know otel, then this is basically your `metadata.yaml`'s entry

For example if we were to use clickhouse's exporter, it's `metadata.yaml` [entry](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/clickhouseexporter#example-config) would look like this:
```yaml
exporters:
  clickhouse:
    endpoint: tcp://127.0.0.1:9000?dial_timeout=10s
    database: otel
    async_insert: true
    ttl: 72h
    compress: lz4
    create_schema: true
    logs_table_name: otel_logs
    traces_table_name: otel_traces
    timeout: 5s
    metrics_tables:
      gauge: 
        name: "otel_metrics_gauge"
      sum: 
        name: "otel_metrics_sum"
      summary: 
        name: "otel_metrics_summary"
      histogram: 
        name: "otel_metrics_histogram"
      exponential_histogram: 
        name: "otel_metrics_exp_histogram"
    retry_on_failure:
      enabled: true
      initial_interval: 5s
      max_interval: 30s
      max_elapsed_time: 300s
    # cluster_name: my_cluster
    # table_engine:
    #   name: ReplicatedMergeTree
    #   params:
service:
  pipelines:
    logs:
      receivers: [ examplereceiver ]
      exporters: [ clickhouse ]
```

Well to be fair, printing on console does not need much configuration. So lets just add a prefix field that will append custom message to each log line.

So if I were to make a go file for this:
```go
package consolelogexporter 

type Config struct {
	Prefix string `mapstructure:"prefix"`
}

func (c *Config) Validate() error {
	/*  We can put here validation logic like:
	 *	if c.Prefix== "" {
		* 	return fmt.Errorf("prefix cannot be empty")
	 * } 
	 */ 	return nil
}
```

Now a few points about this exporter:
- Keen eyes might have noticed that we have named it `consolelogexporter`
- Keener eyes would have noticed that this comes with a contract in form of `Validate()`. This is where you can put any custom logic for validation and throw an error.

So our entry in the `otel-config.yaml` file would look like this:
```yaml
exporters:
  consolelogexporter:
    prefix: "Peepoo: "
```

## Creation: (factory.go)

This is the creation point for our exporter. It tells the collector three things:
- What is your exporter called?
- How to create a default config?
- How to create an actual exporter instance?

```
Customer (Collector) says: "I want a sqliteexporter"
                ↓
Factory says: "I know how to make that. Here's the recipe (config) and here's the finished dish (exporter instance)"
```

The collector doesn't create your exporter directly. It asks your factory to do it.
```go
import (
	"context"

	"go.opentelemetry.io/collector/component"
	"go.opentelemetry.io/collector/exporter"
	"go.opentelemetry.io/collector/exporter/exporterhelper"

	"github.com/open-telemetry/opentelemetry-collector-contrib/exporter/consolelogexporter/internal/metadata"
)
```

```go
func NewFactory() exporter.Factory {
	return exporter.NewFactory(
		metadata.Type,  // This comes from our generated metadata type.
		createDefaultConfig, // Default values for our config struct, needs to be defined in this function
		exporter.WithLogs(createLogsExporter, metadata.LogsStability),
	)
}


func createDefaultConfig() component.Config {
	return &Config{
		Prefix: "Peepu: ",
	}
}

func createLogsExporter(
	ctx context.Context,   // Context for cancellation 	
	set exporter.Settings, //contains everything your exporter needs from the collector's environment. It's a struct the collector populates and hands to your creator function.
	cfg component.Config, // Parsed configuration for the exporter.
) (exporter.Logs, error) {
	c := cfg.(*Config)
	exp := newExporter(c, set.Logger)  // We will implement this function in the next step.

	return exporterhelper.NewLogs(
		ctx,
		set,
		cfg,
		exp.pushLogs, // We will implement this function in the next step.
	)
}
```

## Exporter itself:

Now we implement the real exporter instance.

This is where the actual work happens. The exporter struct holds any state or dependencies needed during the export process, and the pushLogs function receives batches of logs from the collector pipeline.

So lets create `exporter.go`:
```go
package consolelogexporter

import (
	"context"
	"fmt"

	"go.opentelemetry.io/collector/pdata/plog"
	"go.uber.org/zap"
)

type consoleLogExporter struct {
	config *Config
	logger *zap.Logger
}

func newExporter(cfg *Config, logger *zap.Logger) *consoleLogExporter {
	return &consoleLogExporter{
		config: cfg,
		logger: logger,
	}
}

func (e *sqliteExporter) pushLogs(ctx context.Context, ld plog.Logs) error {
	for i := 0; i < ld.ResourceLogs().Len(); i++ {
		rl := ld.ResourceLogs().At(i)

		for j := 0; j < rl.ScopeLogs().Len(); j++ {
			sl := rl.ScopeLogs().At(j)

			for k := 0; k < sl.LogRecords().Len(); k++ {
				lr := sl.LogRecords().At(k)

				fmt.Printf("%s: severity=%s body=%s\n",
					e.config.Prefix,
					lr.SeverityText(),
					lr.Body().AsString(),
				)
			}
		}
	}

	return nil
}
```
The `pushLogs()` function must match the signature `func(context.Context, plog.Logs) error`. The collector calls it whenever a batch of logs flows through your pipeline.

The `plog.Logs` parameter contains a nested hierarchy:
```
plog.Logs
└── ResourceLogs[]           # Grouped by resource (e.g., service)
    └── ScopeLogs[]          # Grouped by instrumentation scope
        └── LogRecords[]     # Individual log entries
            ├── Timestamp
            ├── SeverityNumber
            ├── SeverityText
            ├── Body          # The actual log message
            └── Attributes    # Key-value metadata
```

You iterate through each level to access individual log records. Each LogRecord contains the timestamp, severity, body (the message), and any attributes attached to it.

Return Values: 
Return nil when export succeeds. Return an error to signal failure - the collector's retry mechanism (if configured) will attempt the export again. For permanent failures that shouldn't be retried:

```go
import "go.opentelemetry.io/collector/consumer/consumererror"

// Don't retry this
return consumererror.NewPermanent(fmt.Errorf("invalid data"))
```

## Registering and Building:

Add your exporter to `cmd/otelcontribcol/builder-config.yaml` of the `open-telemetry/opentelemetry-collector-contrib` repository.

```yaml
exporters:
  # ... existing exporters
  - gomod: github.com/open-telemetry/opentelemetry-collector-contrib/exporter/consolelogexporter v0.144.0
```

Rebuild the collector:
```
make otelcontribcol
```

Now you can use the exporter in your configuration file:
```yaml
receivers:
  filelog:
    include: [/var/log/app.log]

exporters:
  consolelogexporter:
    prefix: "pepepoopoo: "

service:
  pipelines:
    logs:
      receivers: [filelog]
      exporters: [consolelogexporter]
```
