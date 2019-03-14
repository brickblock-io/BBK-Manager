// @flow
module.exports = {
  concurrent: true,
  linters: {
    '*.js': ['eslint --fix', 'git add'],
    '*.json': ['jsonlint-cli', 'git add'],
    '*.yaml': ['yamllint', 'git add'],
    '*.yml': ['yamllint', 'git add'],
    '*.md': ['markdownlint --ignore CHANGELOG.md', 'git add'],
  },
}
