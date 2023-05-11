const passport = require('passport');
const {User} = require("../models");
const localPassport = async (req,res,next) => {
    try{
        passport.authenticate('local',(err,user,info) => {
            if (err) {
                console.error(err);
                return next(err);
            }
            if (info) {
                console.log(info.reason);
                return res.status(401).send(info.reason);
            }
            //회원이 로그인 성공시
            return req.login(user, async (loginErr) => {
                return res.status(200).json(user);
            });
        })(req,res,next);
    }catch(e){

    }
}

module.exports = {localPassport}