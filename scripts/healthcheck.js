/* eslint-disable no-console */
const chalk = require('chalk')
const ora = require('ora')
const sh = require('shelljs')

function run(command, options = { silent: true }) {
  return new Promise((resolve, reject) => {
    sh.exec(command, options, function(exitCode, stdout, stderr) {
      exitCode !== 0 ? reject(stderr) : resolve(stdout.trim())
    })
  })
}

async function main() {
  ora('Checking overall project health...').info()

  await runLinters()
  await runFlow()
  await runFlowCoverage()
  await runTests()
  await printTodos()
}

async function runLinters() {
  const spinner = ora('Running linters...').start()

  try {
    await run('yarn lint')
    spinner.succeed(chalk.bold('Linters: 👍'))
  } catch (error) {
    spinner.fail(chalk.bold('Linters: 👎\n'))

    // Need to re-run this to show the user what the error was
    await run('yarn lint', { silent: false })
    throw new Error(error)
  }
}

async function runFlow() {
  const spinner = ora('Running flow...').start()

  try {
    await run('yarn flow')
    spinner.succeed(chalk.bold('Flow: 👍'))
  } catch (error) {
    spinner.fail(chalk.bold('Flow: 👎\n'))

    // Need to re-run this to show the user what the error was
    await run('yarn flow', { silent: false })
    throw new Error(error)
  }
}

async function runFlowCoverage() {
  const spinner = ora('Running flow coverage check...').start()

  try {
    await run('yarn flow:coverage')
    spinner.succeed(chalk.bold('Flow Coverage: 👍'))
  } catch (error) {
    spinner.fail(chalk.bold('Flow Coverage: 👎\n'))

    // Need to re-run this to show the user what the error was
    await run('yarn flow:coverage', { silent: false })

    throw new Error(error)
  }
}

async function runTests() {
  const spinner = ora('Running tests...').start()

  try {
    await run('CI=true yarn test --coverage')
    spinner.succeed(chalk.bold('Tests: 👍'))
  } catch (error) {
    spinner.fail(chalk.bold('Tests: 👎'))
    throw new Error(error)
  }
}

async function printTodos() {
  const spinner = ora('️Searching for open TODOs and FIXMEs...').start()

  let todos

  try {
    todos = await run('yarn todo')
    spinner.info(`${chalk.bold('Todos:')}\n\n${todos}`)
  } catch (error) {
    spinner.fail(chalk.bold('Todos: 👎'))
    throw new Error(error)
  }
}

main()
  .then(() => {
    console.log(`\n${chalk.bold('🙌 Project looks healthy 🙌')}\n`)

    return
  })
  .catch(error => {
    console.error(
      `\n${chalk.bold('❌ Project not healthy ❌')}\n\n${chalk.red(error)}`
    )
  })
