export const getPresignedUploadUrl = async (file: File) => {
  const key = file.name
  const contentType = file.type
  const url = new URL(`${process.env.NEXT_PUBLIC_HOST}/api/images/${key}`)
  url.searchParams.append('contentType', contentType)

  const response = await fetch(url)
  const signedUrl = await response.text()

  return signedUrl
}
