function formatUptime(seconds: number): string {
  const days: number = Math.floor(seconds / 86400)
  const hours: number = Math.floor((seconds % 86400) / 3600)
  const minutes: number = Math.floor((seconds % 3600) / 60)
  const remainingSeconds: number = seconds % 60

  const parts: string[] = []
  if (days > 0) {
    parts.push(`${days}d`)
  }
  if (hours > 0) {
    parts.push(`${hours}h`)
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`)
  }
  if (remainingSeconds > 0) {
    parts.push(`${remainingSeconds}s`)
  }

  return parts.join(" ")
}
