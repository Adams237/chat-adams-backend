const { getAllMessage, addMsg } = require('../controllers/messagesController')

const router = require('express').Router()
 router.post('/sendMsg',addMsg)
router.post('/getAllMsg', getAllMessage)

module.exports = router
