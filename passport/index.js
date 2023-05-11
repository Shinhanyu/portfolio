const passport = require("passport");
const local = require("./localStrategy");
const User = require("../models/user");

module.exports = () => {
    passport.serializeUser((user, done) => { // 서버쪽에 [{ id: 1, cookie: 'clhxy' }]
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            console.log(id);
            const user = await User.findOne({ where: { id }});
            done(null, user); // req.user
        } catch (error) {
            console.error(error);
            done(error);
        }
    });
    local();
};
