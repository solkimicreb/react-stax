const fs = require('fs')
const path = require('path')
const { execSync: exec } = require('child_process')

const examplesPath = path.resolve('examples')
const command = process.env.COMMAND

if (!command) {
  throw new Error('You must specify a command to execute.')
}

const examples = fs
  .readdirSync(examplesPath)
  .filter(dir => fs.statSync(path.join(examplesPath, dir)).isDirectory())

for (let example of examples) {
  example = path.join(examplesPath, example)
  exec(command, {
    cwd: example,
    stdio: 'inherit'
  })
}
