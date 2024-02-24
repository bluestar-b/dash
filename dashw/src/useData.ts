import { useState, useEffect } from "react"

export type SystemInfo = {
  cpu_count: number
  cpu_utilization: { number: number; percent: number }[]
  overall_utilization: number
  disk_usage: { free: number; percent: number; total: number; used: number }
  memory_info: {
    available: number
    percent: number
    total: number
    used: number
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
