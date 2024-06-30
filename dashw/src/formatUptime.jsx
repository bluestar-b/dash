export default function UptimeFormatter({ uptime }) {
  const formatUptime = (uptime) => {
    const hours = Math.floor(uptime / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)
    const seconds = uptime % 60
    return `${hours}h ${minutes}m ${seconds}s`
  }

  return <span>{formatUptime(uptime)}</span>
}
