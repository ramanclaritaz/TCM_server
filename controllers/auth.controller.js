var _service = require('../services/auth.service')
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var _commonService = require('../services/common.service')
var db = require('../shared/config')

var validateErr = require('../utils/validateError');

var config = db.config;


_this = this

exports.authenticate = async function (req, res, next) {
    try {

        var user = await _service.authenticate(req.body.username);
        
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

                return res.status(200).json({
                    status: 200,
                    success: true,
                    token: token,
                    refreshToken: refreshToken,
                    message: "Authentication Successfull"
                })
            }
        }
    } catch (e) {
        var err = await validateErr.validateError(e);
        return res.status(400).json({
            status: 400,
            success: false,
            message: err
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
        var err = await validateErr.validateError(e);
        
        return res.status(400).json({
            status: 400,
            success: false,
            message: err
        })
    }
}


exports.forgotPassword = async function (req, res, next) {

    try {
        // var user = await _commonService.getUser(req);
        var username = req.body.username;

        var user = await _service.authenticate(username);

        if (!username) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Username required"
            });
        }

        if (!user) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Authentication Failed. User not Found"
            });
        } else {
            var record = await _service.updateForgotPassword(username);

            return res.status(202).json({
                status : 202,
                success: true,
                message: "We have sent a new password to your registered email"
            })

        }

    } catch (e) {
        var err = await validateErr.validateError(e);
        return res.status(400).json({
            status: 400,
            success: false,
            message: err
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

            return res.status(202).json({
                status: 202,
                success: true,
                message: "Your new password has been changed successfully!"
            })

        }

    } catch (e) {
        var err = await validateErr.validateError(e);        
        return res.status(400).json({
            status: 400,
            success: false,
            message: err
        });

    }
}