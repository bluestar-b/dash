package main

import (
	"embed"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/shirou/gopsutil/cpu"
	"github.com/shirou/gopsutil/disk"
	"github.com/shirou/gopsutil/host"
	"github.com/shirou/gopsutil/mem"
)

//go:embed dashw/dist/index.html
var content embed.FS

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func roundToTwoDecimal(num float64) float64 {
	return float64(int(num*100)) / 100
}

func handleSystemInfo(conn *websocket.Conn) {
	defer conn.Close()
	cpuCount, _ := cpu.Counts(true)
	for {
		cpuPercent, _ := cpu.Percent(time.Second, true) // change to true to get per core CPU usage
		cpuUtilization := make([]map[string]interface{}, len(cpuPercent))
		for i, val := range cpuPercent {
			cpuUtilization[i] = map[string]interface{}{
				"number":  i,
				"percent": roundToTwoDecimal(val),
			}
		}
		overallCPU, _ := cpu.Percent(time.Second, false)
		overallUtilization := roundToTwoDecimal(overallCPU[0])

		memoryInfo, _ := mem.VirtualMemory()
		diskUsage, _ := disk.Usage("/")
		uptime, _ := host.Uptime()

		systemInfo := map[string]interface{}{
			"cpu_utilization":     cpuUtilization,
			"overall_utilization": overallUtilization,
			"cpu_count":           cpuCount,
			"memory_info": map[string]interface{}{
				"total":     memoryInfo.Total,
				"used":      memoryInfo.Used,
				"available": memoryInfo.Available,
				"percent":   roundToTwoDecimal(memoryInfo.UsedPercent),
			},
			"disk_usage": map[string]interface{}{
				"total":   diskUsage.Total,
				"used":    diskUsage.Used,
				"free":    diskUsage.Free,
				"percent": roundToTwoDecimal(diskUsage.UsedPercent),
			},
			"uptime": uptime,
		}

		jsonData, err := json.Marshal(systemInfo)
		if err != nil {
			log.Println(err)
			return
		}

		if err := conn.WriteMessage(websocket.TextMessage, jsonData); err != nil {
			log.Println(err)
			return
		}

		time.Sleep(500 * time.Millisecond)
	}
}

func main() {
	log.Println("Started.")
	log.Println("http://localhost:4480/")

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		data, err := content.ReadFile("dashw/dist/index.html")
		if err != nil {
			http.Error(w, "could not read file", http.StatusInternalServerError)
			return
		}
		w.Write(data)
	})

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println("Error upgrading to WebSocket:", err)
			return
		}
		defer conn.Close()

		handleSystemInfo(conn)
	})

	log.Fatal(http.ListenAndServe(":4480", nil))
}
