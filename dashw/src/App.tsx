import useData from "./useData"
import { ServerInfo } from "./components/ServerInfo"
import { formatSize } from "./formatSize"
import CpuCores from "./components/CpuUtilization"

const App = () => {
  const data = useData()

  if (!data) {
    return <></>
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full lg:max-w-4xl dark:border-white border-black border-2 p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Server Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* CPU Section */}
          <div>
            <h2 className="text-lg font-semibold mb-2">CPU</h2>
            <ServerInfo label="CPU Count (logical)" value={data.cpu_count} />
            <ServerInfo
              label="CPU Percent"
              value={`${data.overall_utilization}%`}
            />
            <CpuCores cpuData={data} />
          </div>

          {/* Memory Section */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Memory</h2>
            <ServerInfo
              label="Total"
              value={formatSize(data.memory_info.total)}
            />
            <ServerInfo
              label="Used"
              value={formatSize(data.memory_info.used)}
            />
            <ServerInfo
              label="Available"
              value={formatSize(data.memory_info.available)}
            />
            <ServerInfo
              label="Percent"
              value={`${data.memory_info.percent.toFixed(2)}%`}
            />
          </div>

          {/* Disk Section */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Disk</h2>
            <ServerInfo
              label="Total"
              value={formatSize(data.disk_usage.total)}
            />
            <ServerInfo label="Used" value={formatSize(data.disk_usage.used)} />
            <ServerInfo label="Free" value={formatSize(data.disk_usage.free)} />
            <ServerInfo
              label="Percent"
              value={`${data.disk_usage.percent.toFixed(2)}%`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
