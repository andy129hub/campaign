// 导入 next 包
const next = require('next')
// 导入本地 routes
const routes = require('./routes')
// 开发者环境
const app = next({dev: process.env.NODE_ENV !== 'production'})
const handler = routes.getRequestHandler(app)

/*
// With express
const express = require('express')
app.prepare().then(() => {
  express().use(handler).listen(3000)
})
*/

// Without express
const {createServer} = require('http')
app.prepare().then(() => {
  createServer(handler).listen(3000)
})
