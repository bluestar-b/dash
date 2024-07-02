import useData from "./useData"
import { ServerInfo } from "./components/ServerInfo.jsx"
import { formatSize } from "./formatSize"
import CpuCores from "./components/CpuUtilization"
import UptimeFormatter from "./formatUptime.jsx"
import abbreviateNumber from "./abbreviate.js"

const App = () => {
  const data = useData()

  const sortedProcesses = data?.processes.sort(
    (a, b) => b.cpu_percent - a.cpu_percent,
  )

  if (!data) {
    return <></>
  }
  return (
    <div className=" min-h-screen flex items-center justify-center">
      <div className="w-full lg:max-w-4xl dark:border-white border-black lg:border-2 p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Server Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* CPU Section */}
          <div>
            <h2 className="text-2xl font-bold mb-2">CPU</h2>

            {/* <h1 className="text-xs font-bold mb-2">{data.cpu_info.name}</h1>*/}
            <ServerInfo
              label="CPU Cores"
              value={
                <>
                  {`${data.cpu_count_logical} Cores logical`}
                  <br />
                  {`${data.cpu_count_physical} Cores physical`}
                </>
              }
            />

            <ServerInfo
              label="CPU Percent"
              value={`${data.overall_utilization}%`}
            />

            <ServerInfo
              label="CPU Speed"
              value={`${data.cpu_info.speed_mhz / 1000} GHz`}
            />
            <ServerInfo
              label={"Cpu utilization"}
              value={
                <>
                  <div className="h-48 overflow-y-auto">
                    <CpuCores cpuData={data} />
                  </div>
                </>
              }
            />
          </div>

          {/* Memory Section */}
          <div>
            <h2 className="text-2xl font-bold mb-2">Memory</h2>
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
            <h2 className="text-2xl font-bold mb-2">Disk</h2>
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

          <div>
            <h2 className="text-2xl font-bold mb-2">Host</h2>
            <ServerInfo
              label="Uptime"
              value={<UptimeFormatter uptime={data.host.uptime} />}
            />

            <ServerInfo
              label="Boot time"
              value={`${new Date(data.host.boot_time * 1000).toLocaleString()}`}
            />

            <ServerInfo label="Hostname" value={data.host.hostname} />
            <ServerInfo label="Platform" value={data.host.platform} />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">Network I/O</h2>
            <ServerInfo
              label="Bytes Received"
              value={formatSize(data.net_io.bytes_recv)}
            />

            <ServerInfo
              label="Bytes Sent"
              value={formatSize(data.net_io.bytes_sent)}
            />

            <ServerInfo
              label="Packets Received"
              value={abbreviateNumber(data.net_io.packets_recv)}
            />

            <ServerInfo
              label="Packets Sent"
              value={abbreviateNumber(data.net_io.packets_sent)}
            />
          </div>
        </div>

        <div className="overflow-x-auto border-2 rounded-lg mt-4">
          <div className="p-4">
            <h1 className="text-lg font-bold">Processes</h1>
            <h2 className="font-bold text-md">
              {data.host.process_count} Running Procs.{" "}
            </h2>
            <p className="text-xs font-bold">
              Showing process that use cpu more than 0.1%
            </p>
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
                  <div
                    key={process.pid}
                    className="grid grid-cols-3 border-b border-gray-200"
                  >
                    <div className="py-3 px-6 text-left overflow-ellipsis">
                      {process.pid}
                    </div>
                    <div className="py-3 px-6 text-left overflow-ellipsis">
                      {process.name}
                    </div>
                    <div className="py-3 px-6 text-left overflow-ellipsis">
                      {process.cpu_percent.toFixed(2)}%
                    </div>
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
