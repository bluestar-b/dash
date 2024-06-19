import useData from "./useData"
import { ServerInfo } from "./components/ServerInfo.jsx"
import { formatSize } from "./formatSize"
import CpuCores from "./components/CpuUtilization"

const App = () => {
  const data = useData();

    const sortedProcesses = data?.processes.sort((a, b) => b.cpu_percent - a.cpu_percent);

  if (!data) {
    return <></>
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full lg:max-w-4xl dark:border-white border-black lg:border-2 p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Server Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">



          {/* CPU Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">CPU</h2>
            
        <h1 className="text-xs font-bold mb-2">{data.cpu_info.name}</h1>
            <ServerInfo label="CPU Cores (logical)" value={data.cpu_count} />
            <ServerInfo
              label="CPU Percent"
              value={`${data.overall_utilization}%`}
            />
              <ServerInfo
              label="CPU Speed"
              value={`${data.cpu_info.speed_mhz / 1000} GHz`}
            />
               
            <div className=" h-52 overflow-y-auto">
            <CpuCores cpuData={data} />
            </div>
           
          </div>

          {/* Memory Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">Memory</h2>
            <ServerInfo
              label="Total"
              value={formatSize(data.memory_usage.total)}
            />
            <ServerInfo
              label="Used"
              value={formatSize(data.memory_usage.used)}
            />
            <ServerInfo
              label="Free"
              value={formatSize(data.memory_usage.free)}
            />
            <ServerInfo
              label="Percent"
              value={`${data.memory_usage.percent.toFixed(2)}%`}
            />
          </div>

          {/* Disk Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">Disk</h2>
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
      

        <div className="overflow-x-auto border-2 rounded-lg mt-4">
          <div className="p-4">
            <h1 className="text-lg font-bold">Processes</h1>
            <h2 className="font-bold text-md">{sortedProcesses.length} Running Procs. </h2>
            </div>
        
      <div className="shadow-md rounded my-6">
        <div className="flex flex-col h-52">
          <div className="overflow-x-auto">
            <div className="grid grid-cols-3 border-b border-gray-200">
              <div className="py-3 px-6 text-left font-bold">PID</div>
              <div className="py-3 px-6 text-left font-bold">Name</div>
              <div className="py-3 px-6 text-left font-bold">CPU Usage</div>
            </div>
            {sortedProcesses.map((process) => (
              <div key={process.pid} className="grid grid-cols-3 border-b border-gray-200">
                <div className="py-3 px-6 text-left overflow-ellipsis">{process.pid}</div>
                <div className="py-3 px-6 text-left overflow-ellipsis">{process.name}</div>
                <div className="py-3 px-6 text-left overflow-ellipsis">{process.cpu_percent.toFixed(2)}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>


 


      </div>
  
    </div>
  )
}

export default App
