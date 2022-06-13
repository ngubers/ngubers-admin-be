module.exports = (app) => {
    const admin = require('../controllers/admin.controller')
    const auth = require('../controllers/auth.controller')
    const router = require('express').Router()

    router.put('/drivers/:id', auth.authorize, admin.accDriver)
    router.get('/', auth.authorize, admin.driverlist)
    router.get('/allUser', auth.authorize, admin.customerlist)
    router.post('/',  auth.authorize, admin.create)
    router.get('/:id', auth.authorize, admin.find)
    router.put('/:id', auth.authorize, admin.update)
    
    app.use('/api/admin', router)
}