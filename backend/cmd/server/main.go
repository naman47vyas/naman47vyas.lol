package main

import (
	"log"
	"net/http"
	"path/filepath"
)

func main() {
	// Get the absolute path to the frontend/public directory
	publicDir := filepath.Join("..", "..", "..", "frontend", "public")

	// Create a file server for static files
	fs := http.FileServer(http.Dir(publicDir))

	// Handle all routes with the file server
	http.Handle("/", fs)

	// Log server start
	port := ":8010"
	log.Printf("🎮 Steam-themed server starting...")
	log.Printf("📂 Serving files from: %s", publicDir)
	log.Printf("🌐 Server running at http://localhost%s", port)
	log.Printf("Press Ctrl+C to stop the server")

	// Start the server
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatal("Server failed to start: ", err)
	}
}
