var User = require('../models/users.model')
var bcrypt = require('bcryptjs');


const TokenGenerator = require('uuid-token-generator');
const tokgen2 = new TokenGenerator(256, TokenGenerator.BASE62);


_this = this

exports.authenticate = async function (username) {
    try {

        // search for attributes
        var user = User.findOne({
            where: {
                $or: [{
                    email: username
                }, {
                    mobile: username
                }]
            }
        }).then(res => {
            console.log('###---------------');

            if (res) {
                console.log(res);
                return res.dataValues;
            }
        })

        return user;

    } catch (e) {
        throw Error('Error while Paginating listsssss')
    }
}

exports.create = async function (params) {

    var record = User.build({
        name: params.name,
        email: params.email,
        password: bcrypt.hashSync(params.password, 10),
        mobile: params.mobile
    })

    try {
        var savedRecord = await record.save();

        return savedRecord;
    } catch (e) {
        // console.log("---------------");
        // console.log(e.errors[0].message);
        // console.log("---------------");
        // console.log(e);

        throw Error(e)
    }
}

exports.updateForgotPassword = async function (username) {

    try {
        // search for attributes
        var user = User.findOne({
            where: {
                $or: [{
                    email: username
                }, {
                    mobile: username
                }]
            }
        }).then(res => {

            res.password = bcrypt.hashSync("123456", 10);
            res.resetPasswordToken = tokgen2.generate();
            res.resetPasswordExpires = Date.now() + 3600000;

    //         var smtpTransport = nodemailer.createTransport("SMTP",{
    //             service: "Gmail",
    //              auth: {
    //                 user: "kannan.kalai58@gmail.com",
    //                 pass: "kuttykalai@90"
    //             }
    //         });

    //         var mailOptions = {
    //                 from: "kannan.kalai58@gmail.com", // sender address
    //                 to: "kalaivanan.s@claritaz.com", // list of receivers
    //                 subject: "Welcome to TCM", // Subject line
    //                 text: "Congrats", // plaintext body
    //                 html: "<b>Welcome to TCM</b>" // html body
    //         }
    //         smtpTransport.sendMail(mailOptions, function(error, response){
    //             if(error){
    //                 console.log(error);
    //             }else{
    //                 console.log("Message sent: " + response.message);
    //             }

    // // if you don't want to use this transport object anymore, uncomment following line
    // //smtpTransport.close(); // shut down the connection pool, no more messages
    //         });

            res.save();

            return res.dataValues;

        });


        return user;
    } catch (e) {
        throw Error(e + 'updateForgotPassword :: Error while Paginating lists')
    }
}

exports.updatePassword = async function (id, password) {

    try {

        // search for attributes
        var user = User.findOne({
            where: {
                id: id
            }
        }).then(res => {

            res.password = bcrypt.hashSync(password, 10);

            res.save();
            return res.dataValues;
        });

        return user;
    } catch (e) {
        throw Error(e + 'updatePassword :: Error while Paginating lists')
    }
}