import bcrypt from 'bcryptjs'

export const saltAndHashPassword = (password: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    bcrypt.hash(password, 8, function (err, hash) {
      if (err) reject(err)
      resolve(hash)
    })
  })
}
