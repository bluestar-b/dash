import { useState, useEffect } from "react"

function useData() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const ws = new WebSocket(`wss://dash_api.notmycode.dev/`)

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
