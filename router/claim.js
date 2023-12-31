// 招领模块

const express = require('express')

const router = express.Router()

const claim = require('../router_handler/claim.js')

const upload = require('../utils/multer.js')

// 获取招领数据信息
router.get('/api/claim', claim.claimList)

// 管理员删除招领信息
router.delete('/dtclaim', claim.dtClaim)

// 用户添加招领信息
router.post('/user/addclaim', upload.single('img'), claim.addClaim)


// 获取当前用户发布的招领信息
router.get('/user/userclaiminfo', claim.userClaimInfo)

// 用户删除招领信息
router.delete('/user/dtclaim', claim.userClaimdt)

// 用户更新招领状态
router.post('/user/claim/updatestate', claim.updateState)

// 管理员更新招领状态
router.post('/user/claim/adminupdatestate', claim.adminUpdateState)

// 根据id获取招领信息
router.get('/api/claim/id', claim.getClaimItemInfo)

// 用户更新招领数据
router.post('/user/claim/update',claim.updateClaim)

// 用户更新招领图片
router.post('/user/claim/updateimg', upload.single('img'), claim.updateClaimImg)
module.exports = router