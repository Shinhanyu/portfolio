const Sequelize = require("sequelize");

module.exports = class Board extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                user_id: {
                    type: Sequelize.STRING(255),
                    allowNull: true,
                    defaultValue: '',
                    comment: '글쓴사람 아이디'
                },
                writer:{
                  type:Sequelize.STRING(255),
                  allowNull:false,
                  defaultValue: '',
                  comment: '글쓴사람 이름(닉네임)'
                },
                board_secret:{
                  type:Sequelize.ENUM('N','Y'),
                  allowNull:false,
                  defaultValue:'N',
                  comment:'공개 여부 Y: 비밀글 N: 공개'
                },
                board_password:{
                    type:Sequelize.TEXT,
                    allowNull:true,
                    defaultValue: '',
                    comment: '비밀번호'
                },
                subject:{
                    type:Sequelize.STRING(255),
                    allowNull:false,
                    defaultValue: '',
                    comment: '글쓴사람 이름(닉네임)'
                },
                content:{
                    type:Sequelize.TEXT('long'),
                    allowNull:false,
                    comment: '내용'
                },
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: "Board",
                tableName: "board",
                paranoid: true,
                charset: "utf8",
                collate: "utf8_general_ci",
            }
        );
    }
    static associate(db) {
        db.Board.hasMany(db.BoardFile, { foreignKey:'board_id', sourceKey:'id'});
        db.Board.hasMany(db.BoardComment, { foreignKey:'board_id', sourceKey:'id'});
    }
};
