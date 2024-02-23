import { useState, useEffect } from "react"

interface SystemInfo {
  cpu_utilization: number
  cpu_count: number
  memory_info: {
    total: number
    used: number
    available: number
    percent: number
  }
  disk_usage: {
    total: number
    used: number
    free: number
    percent: number
  }
  uptime: number
}

function useData(): SystemInfo | null {
  const [data, setData] = useState<SystemInfo | null>(null)

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4480/ws")

    ws.onopen = () => {
      console.log("Connected to WebSocket")
    }

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      setData(message)
    }

    return () => {
      ws.close()
    }
  }, [])

  return data
}

export default useData
