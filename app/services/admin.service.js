const adminRepository = require('../repositories/admin.respository')

module.exports = {
    async list() {
        try {
            const admin = await adminRepository.findAll()

            return {
                data: admin
            }
        }
        catch(error) {
            console.log(error)
        }
    },

    async create(args) {
        try {
            const admin = await adminRepository.create(args)
            return admin.save()
        }
        catch(error) {
            console.log(error)
        }
    },

    async find(id) {
        try {
            const admin = await adminRepository.findById(id)
            return admin
        } catch(error) {
            console.log(error)
        }
    },

    async findByEmail(email) {
        try {
            const admin = await adminRepository.findByEmail(email)
            return admin
        }
        catch(error) {
            console.log(error)
        }
    },

    async update(id, args) {
        try {
            const admin = await adminRepository.update(id, args)
            return admin
        } catch(error) {
            console.log(error)
        }
    }
}