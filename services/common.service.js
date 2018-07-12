var User = require('../models/users.model')
var jwt_decode = require('jwt-decode');


_this = this

exports.getUser = async function(req){
     var token = '';
      try {       
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            token =  req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            token =  req.query.token;
        }
        var user = jwt_decode(token);             
        return user;
    } catch (e) {
        console.log(e);
        throw Error('Error while getCurrent user')        
    }    

}
