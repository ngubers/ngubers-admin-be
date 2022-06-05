module.exports = (app) => {
    const admin = require('../controllers/admin.controller')
    const auth = require('../controllers/auth.controller')
    const router = require('express').Router()

    router.get('/', auth.authorize, admin.driverlist)
    router.post('/',  auth.authorize, admin.create)
    router.get('/:id', auth.authorize, admin.find)
    router.put('/:id', auth.authorize, admin.update)

    app.use('/api/admin', router)
}