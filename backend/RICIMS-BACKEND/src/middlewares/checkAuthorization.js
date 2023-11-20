const userModel = require("../model/userModel")

exports.checkRICAAuthorization = (req, res, next) => {
    try {
        if (req.user.role === "RICA") {
            next()
        }
        else {
            res.status(403).json({ "message": "no authorization" })
        }
    } catch (error) {
        res.status(400).json({ "message": "no authorization" })
    }
}


exports.checkADMINAuthorization = (req, res, next) => {
    try {
        if (req.user.role === "ADMIN") {
            next()
        }
        else {
            res.status(403).json({ "message": "no authorization" })
        }
    } catch (error) {
        res.status(400).json({ "message": "no authorization" })
    }
}

exports.checkRSButhorization = (req, res, next) => {
    try {
        if (req.user.role === "RSB") {
            next()
        }
        else {
            res.status(403).json({ "message": "no authorization" })
        }
    } catch (error) {
        res.status(400).json({ "message": "no authorization" })
    }
}

exports.checkRAButhorization = (req, res, next) => {
    try {
        if (req.user.role === "RAB") {
            next()
        }
        else {
            res.status(403).json({ "message": "no authorization" })
        }
    } catch (error) {
        res.status(400).json({ "message": "no authorization" })
    }
}


exports.checkPRODUCERAuthorization = (req, res, next) => {
    try {
        if (req.user.role === "PRODUCER") {
            next()
        }
        else {
            res.status(403).json({ "message": "no authorization" })
        }
    } catch (error) {
        res.status(400).json({ "message": "no authorization" })
    }
}

exports.checkApproversAuthorization=(req,res,next)=>{
    try {
        if (req.user.role === "RAB" || req.user.role === "RSB" || req.user.role === "RICA") {
            next()
        }
        else {
            res.status(403).json({ "message": "no authorization" })
        }
    } catch (error) {
        res.status(400).json({ "message": "no authorization" })
    }
}