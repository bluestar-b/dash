const CpuCores = ({ cpuData }) => {
  return (
    <div>
      <div className="flex flex-wrap gap-2 mt-2 items-center mx-auto justify-center">
        {cpuData.cpu_utilization.map((core, index) => (
          <div
            key={index}
            className="flex p-2 flex-col items-center justify-center text-center text-xs font-bold border-2 shadow-md border-black dark:border-white rounded-lg"
            style={{ flex: "1 0 20%" }}
          >
            <div>{`CPU-${core.number}`}</div>
            <div>{`${core.percent.toFixed(2)}%`}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CpuCores
