package main

import (
	"fmt"
	"html/template"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	// WS_S OMIT
	"golang.org/x/net/websocket"
	// WS_E OMIT
)

// EchoServer echos request to ResponseWriter.
func EchoServer(ws *websocket.Conn) {
	defer ws.Close()
	io.Copy(ws, ws)
}

// TSS_S OMIT
// TimeServerSimple just returns the current time each second.
func TimeServerSimple(ws *websocket.Conn) { // HL
	defer ws.Close()
	for {
		websocket.Message.Send(ws, time.Now().Format("2006-01-02 15:04:05.000"))
		time.Sleep(time.Second)
	}
}

// TSS_E OMIT

// TimeServer sends out the current time each second.
// ETS_S OMIT
func EchoTimeServer(ws *websocket.Conn) {
	defer ws.Close()
	type MyTime struct {
		Time string
		I    int
		Msg  string
	}
	type MyCmd struct {
		Cmd  string
		Args []string
	}
	cmd := MyCmd{}
	websocket.JSON.Receive(ws, &cmd) // HL
	// ETS_E OMIT
	// ET2_S OMIT
	tim := MyTime{}
	for i := 0; i < 5; i++ {
		tim.Time = time.Now().Format("2006-01-02 15:04:05")
		tim.Msg = cmd.Cmd + ": " + strings.Join(cmd.Args, ",")
		tim.I = i + 1
		websocket.JSON.Send(ws, tim)
		time.Sleep(time.Second)
	}
	// ET2_E OMIT
}

// HND_S OMIT
func main() {
	// MN_E OMIT
	fs := http.NewServeMux() // Serves from filesystem.
	fs.Handle("/", http.FileServer(http.Dir("./public")))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fs.ServeHTTP(w, r) // HL
	})
	http.HandleFunc("/time", func(w http.ResponseWriter, r *http.Request) {
		s := websocket.Server{Handler: websocket.Handler(TimeServerSimple), Handshake: nil}
		s.ServeHTTP(w, r)
	})
	// HND_E OMIT
	// ETD_S OMIT
	http.HandleFunc("/echo", func(w http.ResponseWriter, r *http.Request) {
		s := websocket.Server{Handler: websocket.Handler(EchoTimeServer), Handshake: nil} // HL
		s.ServeHTTP(w, r)
	})
	// ETD_E OMIT
	// cat -- returns concatenatenation of a and b fields for a URL encoded request.
	// try:
	// curl 'localhost:8123/api/v1/cat?a=brown&b=fox'
	// or
	// curl -d a=brown -d b=fox -X POST localhost:8123/api/v1/cat
	// API_S OMIT
	http.HandleFunc("/api/v1/cat", func(w http.ResponseWriter, r *http.Request) {
		err := r.ParseForm()
		if err != nil {
			log.Println(err)
		}
		fmt.Fprintf(w, "%s\n", r.Form["a"][0]+r.Form["b"][0])
	})
	// API_E OMIT
	// TPL_S OMIT
	http.HandleFunc("/foopage/", func(w http.ResponseWriter, r *http.Request) {
		t := template.Must(template.ParseFiles("public/app-tpl.html"))
		err := t.Execute(w, struct{ Title, Body string }{"Foo", r.URL.Path})
		if err != nil {
			log.Fatal(err)
		}
	})
	// TPL_E OMIT

	// LAS_S OMIT
	log.Fatal(http.ListenAndServe(":"+os.Getenv("PORT"), nil))
}

// LAS_E OMIT
