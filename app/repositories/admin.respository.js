const db = require('../models')

const Admin = db.admin

module.exports = {
    findAll() {
        return Admin.find()
    },
    findById(id) {
        return Admin.findById(id)
    },
    findByEmail(email) {
        return Admin.findOne({email})
    },
    create(args) {
        return new Admin(args)
    },
    update(id, args) {
        return Admin.findByIdAndUpdate(id, args)
    }
}