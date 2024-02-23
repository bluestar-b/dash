package main

import (
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

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func handleSystemInfo(conn *websocket.Conn) {
	defer conn.Close()
	cpuCount, _ := cpu.Counts(true)
	for {
		cpuPercent, _ := cpu.Percent(time.Second, false)
		memoryInfo, _ := mem.VirtualMemory()
		diskUsage, _ := disk.Usage("/")
		uptime, _ := host.Uptime()

		systemInfo := map[string]interface{}{
			"cpu_utilization": cpuPercent[0],
			"cpu_count":       cpuCount,
			"memory_info": map[string]interface{}{
				"total":     memoryInfo.Total,
				"used":      memoryInfo.Used,
				"available": memoryInfo.Available,
				"percent":   memoryInfo.UsedPercent,
			},
			"disk_usage": map[string]interface{}{
				"total":   diskUsage.Total,
				"used":    diskUsage.Used,
				"free":    diskUsage.Free,
				"percent": diskUsage.UsedPercent,
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

		time.Sleep(1 * time.Second)
	}
}

func main() {
	log.Println("Started.")

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
