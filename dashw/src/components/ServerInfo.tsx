export interface ServerInfoProps {
  label: string
  value: string | number
}

export const ServerInfo = ({ label, value }: ServerInfoProps) => (
  <div className="border-2 shadow-md border-black dark:border-white mt-2 p-4 rounded-lg">
    <h2 className="text-lg font-semibold mb-2">{label}</h2>
    <div className="text-lg font-bold">{value}</div>
  </div>
)
