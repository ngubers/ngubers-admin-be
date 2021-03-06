const { default: axios } = require('axios')
const adminervice = require('../services/admin.service')

function encryptPassword(password) {
    return new Promise((resolve, rejected) => {
        bcrypt.hash(password, salt, (err, encryptedPassword) => {
            if (!!err) {
                rejected(err)
                return
            }

            resolve(encryptedPassword)
        })
    })
}

exports.driverlist = async (req, res) => {
    try {
        
        const response = await axios.get('http://localhost:3001/api/drivers',{
            headers:{
                key : "11"
            }
        })
        const{data}=response
        console.log(data);

        res.json({
            status: "OK",
            data: data
        })
    } catch(error) {
        res.status(400).json({
            status: "FAIL",
            message: error.message
        })
    }
}

exports.customerlist = async (req, res) => {
    try {
        
        const response = await axios.get('http://localhost:3000/api/users',{
            headers:{
                key : "11"
            }
        })
        const{data}=response
        console.log(data);

        res.json({
            status: "OK",
            data: data
        })
    } catch(error) {
        res.status(400).json({
            status: "FAIL",
            message: error.message
        })
    }
}

exports.create = async (req, res) => {
    const {full_name, email, password, address} = req.body
    try {
        const encryptedPassword = encryptPassword(password)
        const user = await adminervice.create({
            full_name: full_name,
            email: email,
            password: encryptedPassword,
            address: address
        })
        res.send({
            message: "User berhasil dibuat",
            data: user
        })
    }
    catch(error) {
        res.status(409).send({
            message: error.message || "Some error while create users."
        })
    }
}

exports.find = async (req, res) => {
    try{
        const {id} = req.params
        const user = await adminervice.find(id)
        
        if (!user) {
            throw Error('Data user tidak ditemukan')
        }

        res.json({
            message: "Data user ditemukan",
            data: user
        })

    } catch(error) {
        res.status(404).send({
            message: error.message
        })
    }
}

exports.update = async (req, res) => {
    const {id} = req.params
    const {full_name, email, password, address} = req.body
    try {
        const encryptedPassword = encryptPassword(password)
        const user = await adminervice.update(id, {
            full_name,
            email,
            password: encryptedPassword,
            address
        })

        if (!user) {
            throw Error('User tidak ditemukan')
        }

        res.json({
            message: "Data user berhasil di update",
        })
    } catch(error) {
        res.status(400).json({
            message: error.message
        })
    }
}
exports.accDriver = async (req, res) => {
    try {
        console.log(req.params.id)
        const response = await axios.put(`http://localhost:3001/api/drivers/update/${req.params.id}`,{
            driverId: req.body.driverId,
            status:req.body.status
        },{
            headers:{
                key : "11"
            }
        })
        const{data}=response
        console.log(data);

        res.json({
            status: "OK",
            data: data
        })
    } catch(error) {
        res.status(400).json({
            status: "FAIL",
            message: error.message
        })
    }
}