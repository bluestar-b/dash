const CpuCores = ({ cpuData }) => {
  return (
    <div>
      <div className="flex flex-wrap gap-2 mt-2 items-center mx-auto">
        {cpuData.cpu_utilization.map((core, index) => (
          <div>
            <div
              key={index}
              className="flex p-2 flex-col w-fit items-center justify-center text-center text-xs font-bold border-2 shadow-md border-black dark:border-white rounded-lg"
              style={{
                flex: "0 0 auto",
                aspectRatio: "1 / 1",
              }}
            >
              <div>{`CPU-${core.number}`}</div>
              <div>{`${core.percent.toFixed(2)}%`}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CpuCores
