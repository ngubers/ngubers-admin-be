const adminervice = require('../services/admin.service')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const salt = 10

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

function checkPassword(encryptedPassword, password) {
    return new Promise((resolve, rejected) => {
        bcrypt.compare(
            password,
            encryptedPassword,
            (err, isPasswordCorrect) => {
                if (!!err) {
                    rejected(err)
                    return
                }

                resolve(isPasswordCorrect)
            }
        )
    })
}

function validateEmail(email) {
    return email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
}

function createToken(payload) {
    return jwt.sign(payload, process.env.JWT_SIGNATURE_KEY || "Ngubers")
}

exports.register = async (req, res) => {
    const {full_name, email, password, phone_number, address, no_ktp, file} = req.body
    try {

        if (full_name === "" || email === "" || 
            password === "" || no_ktp === "" || file === "") {
            res.statusCode = 400
            res.json({
                status: false,
                message: "Email, Nama Lengkap, Nomor Hp, Password, No KTP dan File harus diisi"
            })

            return
        }

        if (!validateEmail(email)) {
            res.statusCode = 400
            res.json({
                status: false,
                message: "Email yang dimasukkan tidak valid"
            })

            return
        }

        const emailExist = await adminervice.findByEmail(email)

        if (emailExist) {
            res.statusCode = 400
            res.json({
                status: false,
                message: "Email sudah digunakan sebelumnya"
            })

            return
        }

        const encryptedPassword = await encryptPassword(password)
        const admin = await adminervice.create({
            full_name,
            email,
            password: encryptedPassword,
            phone_number,
            address,
            no_ktp,
            status: 'waiting_response',
            file: req.file.originalname,
        })
        res.statusCode = 201
        res.json({
            status: true,
            message: "admin berhasil dibuat",
            data: admin
        })
    }
    catch(error) {
        res.statusCode = 500
        res.json({
            status: false,
            message: error.message || "Some error while create admin."
        })
    }
}

exports.login = async (req, res) => {
    const {email, password} = req.body
    try {
        const admin = await adminervice.findByEmail(email)
        if (!admin) {
            res.statusCode = 404
            res.json({
                status: false,
                message: "Email tidak ditemukan"
            })

            return
        }

        const isPasswordCorrect = await checkPassword(
            admin.password,
            password
        )

        if (!isPasswordCorrect) {
            res.statusCode = 404
            res.json({
                status: false,
                message: "Password salah!"
            })

            return
        }

        const token = createToken({
            id: admin.id,
            email: admin.email,
        })
        res.statusCode = 200
        res.json({
            status: true,
            message: "Berhasil login",
            token
        })

    } catch(error) {
        console.log(error)
        res.statusCode = 500
        res.json({
            status: false,
            message: "Terjadi kesalahan di server"
        })
    }
}

exports.authorize = async (req, res, next) => {
    try {
        
        const bearerToken = req.headers.authorization
        const token = bearerToken.split("Bearer ")[1]
        const tokenPayload = jwt.verify(
            token,
            process.env.JWT_SIGNATURE_KEY || "Ngubers"
        )
        req.admin = await adminervice.find(tokenPayload.id)
        next()
    }
    catch(error) {
        console.log("error admin")
        console.log(error)
        res.status(401).json({
            message: 'Unauthorized'
        })
    }
}
