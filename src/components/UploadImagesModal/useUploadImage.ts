export const useUploadImage = () => {
  const getPresignedUrl = async (key: string) => {
    const response = await fetch(`/api/images/${key}`)
    const signedUrl = await response.text()
    return signedUrl
  }

  const uploadImage = async (file: File) => {
    const signedUrl = await getPresignedUrl(file.name)
    const response = await fetch(signedUrl, {
      method: 'PUT',
      body: file,
    })

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }
  }

  return { uploadImage }
}
