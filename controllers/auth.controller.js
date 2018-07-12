var _service = require('../services/auth.service')
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var _commonService = require('../services/common.service')
var db = require('../shared/config')
var config = db.config;

_this = this

exports.authenticate = async function (req, res, next) {
    try {

        var user = await _service.authenticate(req.body.email);
        
        if (!user) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Authentication Failed. User not Found"
            });
        } else {
            var validPassword = bcrypt.compareSync(req.body.password, user.password)

            if (!validPassword) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: "Authentication failed. Wrong Password "
                })

            } else {

                var token = jwt.sign({
                    'user': user
                }, config.secret, {
                    expiresIn: config.tokenLife // expires in 12 hours
                });
                var refreshToken = jwt.sign(user, config.refreshTokenSecret, {
                    expiresIn: config.refreshTokenLife
                })

                return res.status(201).json({
                    status: 201,
                    success: true,
                    token: token,
                    refreshToken: refreshToken,
                    message: "Authentication Successfull"
                })
            }
        }
    } catch (e) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: e.message
        });

    }

}

exports.register = async function (req, res, next) {

    try {
        var createdRecord = await _service.create(req.body)
        return res.status(201).json({
            status: 201,
            data: createdRecord,
            success: true,
            message: "Succesfully Created "
        })
    } catch (e) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "Creation was Unsuccesfull " + e
        })
    }
}


exports.forgotPassword = async function (req, res, next) {

    try {
        // var user = await _commonService.getUser(req);
        var email = req.body.email;

        var user = await _service.authenticate(email);

        if (!email) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Email required"
            });
        }

        if (!user) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Authentication Failed. User not Found"
            });
        } else {
            var record = await _service.updateForgotPassword(email);

            return res.status(201).json({
                status: 201,
                success: true,
                message: "We have sent a new password to your registered email"
            })

        }

    } catch (e) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: e.message
        });

    }
}

exports.changePassword = async function (req, res, next) {

    try {

        var currentPassword = req.body.current_password;
        var newPassword = req.body.new_password;
        var confirmPassword = req.body.confirm_password;

        if (newPassword != confirmPassword) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Your newpassword and confirm password should same!"
            });
        }

        var user = await _commonService.getUser(req);
        user = user.user;

        var validPassword = bcrypt.compareSync(currentPassword, user.password);

        if (!validPassword) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Authentication failed. Wrong your current password "
            })

        } else {
            var record = await _service.updatePassword(user.id, newPassword);

            return res.status(201).json({
                status: 201,
                success: true,
                message: "Your new password has been changed successfully!"
            })

        }

    } catch (e) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: e.message
        });

    }
}