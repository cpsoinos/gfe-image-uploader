// function getFlagEmoji(countryCode: string) {
//   const codePoints = countryCode
//     .toUpperCase()
//     .split('')
//     .map((char) => 127397 + char.charCodeAt())
//   return String.fromCodePoint(...codePoints)
// }

// const getFlagEmoji = (countryCode: string) =>
//   String.fromCodePoint(...[...countryCode.toUpperCase()].map((x) => 0x1f1a5 + x.charCodeAt()))

export const getFlagEmoji = (countryCode: string) =>
  String.fromCodePoint(...[...countryCode.toUpperCase()].map((x) => 0x1f1a5 + x.charCodeAt(0)))
