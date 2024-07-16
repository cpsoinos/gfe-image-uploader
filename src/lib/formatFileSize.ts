export function formatFileSize(bytes: number): string {
  const sizes = [' bytes', 'kb', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))

  if (i > 1) {
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + sizes[i]
  } else {
    return Math.round(bytes / Math.pow(1024, i)) + sizes[i]
  }
}
