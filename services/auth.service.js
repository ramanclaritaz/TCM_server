var User = require('../models/users.model')
var bcrypt = require('bcryptjs');

const TokenGenerator = require('uuid-token-generator');
const tokgen2 = new TokenGenerator(256, TokenGenerator.BASE62);


_this = this

exports.authenticate = async function (email) {
    try {
        // search for attributes
        var user = User.findOne({
            where: {
                email: email
            }
        }).then(res => {
            // project will be the first entry of the Projects table with the title 'aProject' || null
            // console.log(project);
            if(res){return res.dataValues;}
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

        throw Error("Error while Creating User ")
    }
}

exports.updateForgotPassword = async function (email) {

    try {
        // search for attributes
        var user = User.findOne({where: {email: email}}).then(res => {            
           
            res.password = bcrypt.hashSync("123456", 10);
            res.resetPasswordToken = tokgen2.generate();
            res.resetPasswordExpires = Date.now() + 3600000 ;

            res.save();

            return res.dataValues;

        });

        
        return user;
    } catch (e) {
        throw Error(e + 'updateForgotPassword :: Error while Paginating lists')
    }
}

exports.updatePassword = async function(id,password){

    try {

        // search for attributes
        var user = User.findOne({where: {id: id}}).then(res => {            
          
            res.password = bcrypt.hashSync(password, 10);
           
            res.save();
            return res.dataValues;
        });

        return user;
    } catch (e) {
        throw Error(e + 'updatePassword :: Error while Paginating lists')
    }
}