'use strict'

import Router from 'koa-router'
import bodyparser from 'koa-bodyparser'
import crypto from 'crypto'
import fs from 'fs'
import { alistServer, webdavServer, port, initAlistConfig, version } from './config'
import { getUserInfo, cacheUserToken, getUserByToken, updateUserInfo } from './dao/userDao'
import responseHandle from './middleware/responseHandle'
import { encodeFolderName, decodeFolderName } from './utils/commonUtil'
import { encryptFile, searchFile } from './utils/convertFile'

// bodyparser解析body
const bodyparserMw = bodyparser({ enableTypes: ['json', 'form', 'text'] })

// 总路径，添加所有的子路由
const allRouter = new Router()
// 拦截全部
allRouter.all(/^\/enc-api\/*/, bodyparserMw, responseHandle, async (ctx, next) => {
  console.log('@@log request-url: ', ctx.req.url)
  await next()
})

// 白名单路由
allRouter.all('/enc-api/login', async (ctx, next) => {
  const { username, password } = ctx.request.body
  console.log(username, password)
  const userInfo = await getUserInfo(username)
  console.log(userInfo)
  if (userInfo && password === userInfo.password) {
    // 创建token
    const token = crypto.randomUUID()
    // 异步执行
    cacheUserToken(token, userInfo)
    userInfo.password = null
    ctx.body = { data: { userInfo, jwtToken: token } }
    return
  }
  ctx.body = { msg: 'passwword error', code: 500 }
})

// 拦截登录
allRouter.all(/^\/enc-api\/*/, async (ctx, next) => {
  // nginx不支持下划线headers
  const { authorizetoken: authorizeToken } = ctx.request.headers
  // 查询数据库是否有密码
  const userInfo = await getUserByToken(authorizeToken)
  if (userInfo == null) {
    ctx.body = { code: 401, msg: 'user unlogin' }
    return
  }
  ctx.userInfo = userInfo
  await next()
})

// 设置前缀
const router = new Router({ prefix: '/enc-api' })

// 用户信息
router.all('/getUserInfo', async (ctx, next) => {
  const userInfo = ctx.userInfo
  console.log('@@getUserInfo', userInfo)
  userInfo.password = null
  const data = {
    codes: [16, 9, 10, 11, 12, 13, 15],
    userInfo,
    menuList: [],
    roles: ['admin'],
    version,
  }
  ctx.body = { data }
})

// 更新用户信息
router.all('/updatePasswd', async (ctx, next) => {
  const { password, newpassword, username } = ctx.request.body
  if (newpassword.length < 7) {
    ctx.body = { msg: 'password too short, at less 8 digits', code: 500 }
    return
  }
  const userInfo = await getUserInfo(username)
  if (password !== userInfo.password) {
    ctx.body = { msg: 'password error', code: 500 }
    return
  }
  userInfo.password = newpassword
  updateUserInfo(userInfo)
  ctx.body = { msg: 'update success' }
})

router.all('/getAlistConfig', async (ctx, next) => {
  ctx.body = { data: alistServer._snapshot }
})

router.all('/saveAlistConfig', async (ctx, next) => {
  let alistConfig = ctx.request.body
  for (const index in alistConfig.passwdList) {
    const passwdInfo = alistConfig.passwdList[index]
    if (typeof passwdInfo.encPath === 'string') {
      passwdInfo.encPath = passwdInfo.encPath.split(',')
    }
  }
  const _snapshot = JSON.parse(JSON.stringify(alistConfig))
  // 写入到文件中，这里并不是真正的同步，，
  fs.writeFileSync(process.cwd() + '/conf/config.json', JSON.stringify({ alistServer: _snapshot, webdavServer, port }, '', '\t'))
  alistConfig = initAlistConfig(alistConfig)
  Object.assign(alistServer, alistConfig)
  alistServer._snapshot = _snapshot
  ctx.body = { msg: 'save ok' }
})

router.all('/getWebdavonfig', async (ctx, next) => {
  ctx.body = { data: webdavServer }
})

router.all('/saveWebdavConfig', async (ctx, next) => {
  const config = ctx.request.body
  for (const index in config.passwdList) {
    const passwdInfo = config.passwdList[index]
    if (typeof passwdInfo.encPath === 'string') {
      passwdInfo.encPath = passwdInfo.encPath.split(',')
    }
  }
  config.id = crypto.randomUUID()
  webdavServer.push(config)
  fs.writeFileSync(process.cwd() + '/conf/config.json', JSON.stringify({ alistServer: alistServer._snapshot, webdavServer, port }, '', '\t'))
  ctx.body = { data: webdavServer }
})

router.all('/updateWebdavConfig', async (ctx, next) => {
  const config = ctx.request.body
  for (const index in config.passwdList) {
    const passwdInfo = config.passwdList[index]
    if (typeof passwdInfo.encPath === 'string') {
      passwdInfo.encPath = passwdInfo.encPath.split(',')
    }
  }

  for (const index in webdavServer) {
    if (webdavServer[index].id === config.id) {
      webdavServer[index] = config
    }
  }
  fs.writeFileSync(process.cwd() + '/conf/config.json', JSON.stringify({ alistServer: alistServer._snapshot, webdavServer, port }, '', '\t'))
  ctx.body = { data: webdavServer }
})

router.all('/delWebdavConfig', async (ctx, next) => {
  const { id } = ctx.request.body
  for (const index in webdavServer) {
    if (webdavServer[index].id === id) {
      webdavServer.splice(index, 1)
    }
  }
  fs.writeFileSync(process.cwd() + '/conf/config.json', JSON.stringify({ alistServer: alistServer._snapshot, webdavServer, port }, '', '\t'))
  ctx.body = { data: webdavServer }
})

// get folder passwd encode
router.all('/encodeFoldName', async (ctx, next) => {
  const { password, encType, folderPasswd, folderEncType } = ctx.request.body
  const folderNameEnc = encodeFolderName(password, encType, folderPasswd, folderEncType)
  ctx.body = { data: { folderNameEnc } }
  console.log('@@encodeFoldName', password, folderNameEnc)
})

router.all('/decodeFoldName', async (ctx, next) => {
  const { password, folderNameEnc, encType } = ctx.request.body
  const arr = folderNameEnc.split('_')
  if (arr.length < 2) {
    ctx.body = { msg: 'folderName not encdoe', code: 500 }
    return
  }
  const data = decodeFolderName(password, encType, folderNameEnc)
  if (!data) {
    ctx.body = { msg: 'folderName is error', code: 500 }
    return
  }
  const { folderEncType, folderPasswd } = data
  ctx.body = { data: { folderEncType, folderPasswd } }
})

// encrypt or decrypt file
router.all('/encryptFile', async (ctx, next) => {
  const { folderPath, outPath, encType, password, operation, encName } = ctx.request.body
  if (!fs.existsSync(folderPath)) {
    ctx.body = { msg: 'encrypt file path not exists', code: 500 }
    return
  }
  const files = searchFile(folderPath)
  if (files.length > 10000) {
    ctx.body = { msg: 'too maney file, exceeding 10000', code: 500 }
    return
  }
  encryptFile(password, encType, operation, folderPath, outPath, encName)
  ctx.body = { msg: 'waiting operation' }
})

// 用这种方式代替前缀的功能，{ prefix: } 不能和正则联合使用
allRouter.use(router.routes(), router.allowedMethods())

// restRouter.all(/\/enc-api\/*/, router.routes(), restRouter.allowedMethods())
export default allRouter
