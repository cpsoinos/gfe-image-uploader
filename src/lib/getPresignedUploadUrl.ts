export const getPresignedUploadUrl = async (file: File) => {
  const key = file.name
  const contentType = file.type
  const url = new URL(`/api/images/${key}`, location.origin)
  url.searchParams.append('contentType', contentType)

  const response = await fetch(url, { method: 'PUT' })

  if (response.ok) {
    const signedUrl = await response.text()
    return signedUrl
  } else {
    throw new Error('Server error when attempting to generate presigned URL')
  }
}
