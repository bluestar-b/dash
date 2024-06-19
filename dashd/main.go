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
	"github.com/shirou/gopsutil/net"
	"github.com/shirou/gopsutil/process"
)

//go :embed dashw/dist/index.html
//var content embed.FS

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func roundToTwoDecimal(num float64) float64 {
	return float64(int(num*100)) / 100
}

/*
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
			cpu_info, _ := cpu.Info()
			//fmt.Println(cpu_info)

			hostInfo, _ := host.Info()
			//fmt.Printf("Host Info: %+v\n", hostInfo)

			netIO, _ := net.IOCounters(false)
			//fmt.Printf("Network IO: %+v\n", netIO)

			systemInfo := map[string]interface{}{
				"net_io": map[string]interface{}{
					"bytes_sent":   netIO[0].BytesSent,
					"bytes_recv":   netIO[0].BytesRecv,
					"packets_sent": netIO[0].PacketsSent,
					"packets_recv": netIO[0].PacketsRecv,
					"errin":        netIO[0].Errin,
					"errout":       netIO[0].Errout,
					"dropin":       netIO[0].Dropin,
					"dropout":      netIO[0].Dropout,
				},
				"host": map[string]interface{}{
					"hostname":  hostInfo.Hostname,
					"uptime":    hostInfo.Uptime,
					"boot_time": hostInfo.BootTime,
				},
				"cpu_info": map[string]interface{}{
					"name":      cpu_info[0].ModelName,
					"speed_mhz": cpu_info[0].Mhz,
					"cores":     cpu_info[0].Cores,
				},
				"cpu_utilization":     cpuUtilization,
				"overall_utilization": overallUtilization,
				"cpu_count":           cpuCount,
				"memory_usage": map[string]interface{}{
					"total":   memoryInfo.Total,
					"used":    memoryInfo.Used,
					"free":    memoryInfo.Available,
					"percent": roundToTwoDecimal(memoryInfo.UsedPercent),
				},
				"disk_usage": map[string]interface{}{
					"total":   diskUsage.Total,
					"used":    diskUsage.Used,
					"free":    diskUsage.Free,
					"percent": roundToTwoDecimal(diskUsage.UsedPercent),
				},
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
*/
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
		cpu_info, _ := cpu.Info()
		//fmt.Println(cpu_info)

		hostInfo, _ := host.Info()
		//fmt.Printf("Host Info: %+v\n", hostInfo)

		netIO, _ := net.IOCounters(false)
		//fmt.Printf("Network IO: %+v\n", netIO)

		// Get process list
		processes, err := process.Processes()
		if err != nil {
			log.Println(err)
			return
		}

		processList := make([]map[string]interface{}, len(processes))
		for i, proc := range processes {
			// Get process details
			name, _ := proc.Name()
			pid := proc.Pid
			cpuPercent, _ := proc.CPUPercent()

			// Add process details to the list
			processList[i] = map[string]interface{}{
				"pid":         pid,
				"name":        name,
				"cpu_percent": cpuPercent,
			}
		}

		systemInfo := map[string]interface{}{
			"net_io": map[string]interface{}{
				"bytes_sent":   netIO[0].BytesSent,
				"bytes_recv":   netIO[0].BytesRecv,
				"packets_sent": netIO[0].PacketsSent,
				"packets_recv": netIO[0].PacketsRecv,
				"errin":        netIO[0].Errin,
				"errout":       netIO[0].Errout,
				"dropin":       netIO[0].Dropin,
				"dropout":      netIO[0].Dropout,
			},
			"host": map[string]interface{}{
				"hostname":  hostInfo.Hostname,
				"uptime":    hostInfo.Uptime,
				"boot_time": hostInfo.BootTime,
			},
			"cpu_info": map[string]interface{}{
				"name":      cpu_info[0].ModelName,
				"speed_mhz": cpu_info[0].Mhz,
				"cores":     cpu_info[0].Cores,
			},
			"cpu_utilization":     cpuUtilization,
			"overall_utilization": overallUtilization,
			"cpu_count":           cpuCount,
			"memory_usage": map[string]interface{}{
				"total":   memoryInfo.Total,
				"used":    memoryInfo.Used,
				"free":    memoryInfo.Available,
				"percent": roundToTwoDecimal(memoryInfo.UsedPercent),
			},
			"disk_usage": map[string]interface{}{
				"total":   diskUsage.Total,
				"used":    diskUsage.Used,
				"free":    diskUsage.Free,
				"percent": roundToTwoDecimal(diskUsage.UsedPercent),
			},
			"processes": processList,
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

		time.Sleep(400 * time.Millisecond)
	}
}

func main() {
	log.Println("Started.")

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
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
