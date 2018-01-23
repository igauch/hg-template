const path = require('path')
const fs = require('fs')

const {
  sortDependencies,
  installDependencies,
  runLintFix,
  printMessage,
  checkHG
} = require('./utils')
const pkg = require('./package.json')

const templateVersion = pkg.version

const {addTestAnswers} = require('./scenarios')

module.exports = {
  metalsmith: {
    // When running tests for the template, this adds answers for the selected scenario
    before: addTestAnswers
  },
  helpers: {
    if_or(v1, v2, options) {

      if (v1 || v2) {
        return options.fn(this)
      }

      return options.inverse(this)
    },
    template_version() {
      return templateVersion
    },
  },

  prompts: {
    "name": {
      "type": "string",
      "required": true,
      "message": "项目名"
    },
    "version": {
      "type": "string",
      "required": false,
      "message": "项目版本",
      "default": "1.0.0"
    },
    "port": {
      "type": "number",
      "required": true,
      "message": "端口号",
      "default": "8089"
    },
    autoInstall: {
      when: 'isNotTest',
      type: 'list',
      message:
        '是否在创建完成后就帮你安装依赖以快速开始项目',
      choices: [
        {
          name: 'Yes, use NPM',
          value: 'npm',
          short: 'npm',
        }, {
          name: 'Yes, use Yarn',
          value: 'yarn',
          short: 'yarn',
        },
        {
          name: 'No, I will handle that myself',
          value: false,
          short: 'no',
        }
      ],
    },
    autoCheckHG: {
      when: 'isNotTest',
      type: 'list',
      message:
        '是否在依赖安装完成后就立即帮你运行`npm run hg`以检出HG快速开始项目（如果没有选择自动安装依赖，此项将一直无效）',
      choices: [
        {
          name: '是的',
          value: 'hg',
          short: 'hg',
        },
        {
          name: '不，我自己会的',
          value: false,
          short: 'no',
        }
      ],
    }
  },
  filters: {
    '.eslintrc.js': 'lint',
    '.eslintignore': 'lint',
    'config/test.env.js': 'unit || e2e',
    'build/webpack.test.conf.js': "unit && runner === 'karma'",
    'test/unit/**/*': 'unit',
    'test/unit/index.js': "unit && runner === 'karma'",
    'test/unit/jest.conf.js': "unit && runner === 'jest'",
    'test/unit/karma.conf.js': "unit && runner === 'karma'",
    'test/unit/specs/index.js': "unit && runner === 'karma'",
    'test/unit/setup.js': "unit && runner === 'jest'",
    'test/e2e/**/*': 'e2e',
    'src/router/**/*': 'router',
  },
  complete: function (data, {chalk}) {
    const green = chalk.green

    sortDependencies(data, green)

    const cwd = path.join(process.cwd(), data.inPlace ? '' : data.destDirName)

    function autoHG() {
      if (data.autoCheckHG) {
        checkHG(cwd, data.autoCheckHG, green)
          .then(() => {
            return runLintFix(cwd, data, green)
          })
          .then(() => {
            printMessage(data, green)
          })
          .catch(e => {
            console.log(chalk.red('Error:'), e)
          })
      } else {
        printMessage(data, chalk)
      }
    }

    if (data.autoInstall) {
      installDependencies(cwd, data.autoInstall, green)
        .then(() => {
          autoHG();
        })
        .then(() => {
          printMessage(data, green)
        })
        .catch(e => {
          console.log(chalk.red('Error:'), e)
        })
    } else {
      printMessage(data, chalk)
    }
  }
};

