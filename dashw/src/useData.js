import { useState, useEffect } from "react"

function useData() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.hostname}:4480/`)

    ws.onopen = () => {
      console.log("Connected to WebSocket")
    }

    ws.onmessage = event => {
      const message = JSON.parse(event.data)
      setData(message)
      console.log(event.data)
    }

    return () => {
      ws.close()
    }
  }, [])

  return data
}

export default useData
