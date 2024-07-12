const path = require('path')

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames.map((f) => path.relative(process.cwd(), f)).join(' --file ')}`

module.exports = {
  '*.{js,jsx,cjs,mjs,ts,tsx,mts}': ['prettier --write', 'oxlint --fix', buildEslintCommand],
  'package.json': 'sort-package-json',
}
