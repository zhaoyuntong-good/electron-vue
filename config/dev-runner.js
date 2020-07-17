'use strict'
// 引入chalk，定义命令行输出字体颜色
const chalk = require('chalk');
// 引入cfonts，定义命令行输出字体样式
const { say } = require('cfonts');
// 引入electron
const electron = require('electron');
// 引入nodejs中path模块
const path = require('path');
// 引入nodejs中子进程模块
const { spawn } = require('child_process');
// 引入webpack
const webpack = require('webpack');
// 引入webpack开发服务器，实现热加载
const WebpackDevServer = require('webpack-dev-server');
// 引入主进程配置
const mainConfig = require('./webpack.main.config')
const rendererConfig = require('./webpack.renderer.config')

let electronProcess = null;

function startRenderer () {
  return new Promise((resolve, reject) => {
    rendererConfig.mode = 'development'
    const compiler = webpack(rendererConfig)
    const server = new WebpackDevServer(
      compiler,
      {
        contentBase: path.join(__dirname, '../src'),
        quiet: true,
        before (app, ctx) {
          ctx.middleware.waitUntilValid(() => {
            resolve()
          })
        }
      }
    )
    server.listen(9080)
  })
}

let startElectron = () => {
	mainConfig.mode = 'development';
	let args = [
    path.join(__dirname, '../dist/electron/main.js')
  ];
  electronProcess = spawn(electron, args);
  electronProcess.stdout.on('data', data => {
  	console.log('成功')
  });
  electronProcess.stderr.on('data', data => {
  	console.log('失败')
  });
  electronProcess.on('close', () => {
    process.exit()
  });
}

// 初始化函数
let init = () => {
	startRenderer().then(() => {
		// startElectron()
	})
}

init();