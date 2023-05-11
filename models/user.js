const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                user_id: {
                    type: Sequelize.STRING(255),
                    allowNull: false,
                    unique: true,
                    defaultValue: '',
                    comment: '회원아이디'
                },
                user_password: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                    defaultValue: '',
                    comment: '회원비밀번호'
                },
                user_name: {
                    type: Sequelize.STRING(255),
                    allowNull: false,
                    defaultValue: '',
                    comment: '회원이름'
                },
                user_nick: {
                    type: Sequelize.STRING(255),
                    allowNull: false,
                    defaultValue: '',
                    comment: '회원닉네임'
                },
                user_hp: {
                    type: Sequelize.STRING(255),
                    allowNull: true,
                    defaultValue: '',
                    comment: '회원연락처'
                },
                user_photo:{
                    type: Sequelize.STRING(255),
                    allowNull: true,
                    defaultValue: '',
                    comment: '회원사진'
                },
                user_email:{
                    type: Sequelize.STRING(255),
                    allowNull: true,
                    defaultValue: '',
                    comment: '회원이메일'
                },
                user_level:{
                    type: Sequelize.INTEGER.UNSIGNED,
                    allowNull: false,
                    defaultValue: 2,
                    comment: '0:탈퇴회원 1:준회원 2:정회원 10:관리자'
                }
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: "User",
                tableName: "users",
                paranoid: true,
                charset: "utf8",
                collate: "utf8_general_ci",
            }
        );
    }

    static associate(db) {

    }
};
