const express = require("express");
const passport = require('passport');
const bcrypt = require('bcrypt');
const {User} = require('../models');
const {isNotLogin} = require('./middlewares');
const router = express.Router();


router.get("/",async (req,res,next) => {
   console.log(req.user);
   return res.status(200).json(req.user);
});
//회원 아이디 중복체크하기
router.post("/id_check", async (req,res,next) => {
    try{
        if(req.body.user_id==='test01'){
            return res.status(200).json({
                is_check: false,
                message: '중복된 아이디가 있습니다'
            })
        }
        // noinspection JSCheckFunctionSignatures
        const user = await User.findOne({
            where:{
                user_id:req.body.user_id
            }
        });
        if(user) {
            return res.status(200).json({
                is_check: false,
                message: '중복된 아이디가 있습니다'
            })
        }
        return res.status(200).json({
            is_check:true,
            message:'사용하실 수 있는 아이디입니다'
        });
    }catch(error){
        console.error(error);
    }
}).get("/id_check", async (req,res,next) => {
    try{
        // noinspection JSCheckFunctionSignatures
        const user = await User.findOne({
            where:{
                user_id:req.query.user_id
            }
        });
        if(user) {
            return res.status(403).json({
                is_check: false,
                message: '중복된 아이디가 있습니다'
            })
        }
        return res.status(200).json({
            is_check:true,
            message:'사용하실 수 있는 아이디입니다'
        });
    }catch(error){
        console.error(error);
        return res.status(200).json({
            is_check: false,
            message: '오류발생'
        });
    }
});
//회원가입하기
router.post("/signup", async  (req,res,next) => {
    try{
        const user = await User.findOne({
            where:{
                user_id:req.body.user_id
            }
        });
        const hashPassword =await bcrypt.hash(req.body.user_password,12);
        if(user){
            return res.status(200).json({
                is_success:false,
                message:'이미 가입된 회원입니다. 다른 아이디로 입력하여 주십시오.'
            });
        }

        await User.create({
            user_id:req.body.user_id,
            user_name:req.body.user_name,
            user_password:hashPassword,
            user_nick:req.body.user_nick,
            user_hp:req.body.user_hp,
            user_photo:''
        });
        return res.status(200).json({
            is_success:true,
            message:'회원가입이 완료되었습니다'
        });
    }catch(error){
        console.error(error);
    }
});
//로그인
router.post("/signin", async (req,res,next) => {
    //await localPassport(req,res,next);
    try{
        passport.authenticate('local',(err,user,info) => {
            if (err) {
                console.error(err);
                return next(err);
            }
            if (info) {
                console.log(info.reason);
                return res.status(200).json({is_login:false,message:info.reason});
            }
            //회원이 로그인 성공시
            return req.login(user, async (loginErr) => {
                req.session.user=req.user;
                return res.status(200).json({is_login:true,user:user});
            });
        })(req,res,next);
    }catch(error){
        console.error(error);
    }
});

//회원로그아웃
router.get('/signout',async (req,res,next) => {
   try{
       console.log(req.user);
       req.logout(()=>{
          return res.status(200).json({is_logout:true});
       });
   } catch{

   }
});

module.exports = router;