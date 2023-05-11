const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
          usernameField: 'user_id',
          passwordField: 'user_password',
      },
      async (user_id, user_password, done) => {
        try {
          //회원 아이디로 조회하기
          const user = await User.findOne({
            where:{user_id}
          });
          //회원가입이 안 되어있으면
          if(!user){
            return done(null,false,{ reason : '회원가입을 하지 않은 아이디입니다.'});
          }

          const result = await bcrypt.compare(user_password,user.user_password);
          //비밀번호가 맞으면
          if(result){
              console.log(result);
              return done(null, user);
          }
          return done(null, false, { reason: '비밀번호가 틀렸습니다.' });
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
