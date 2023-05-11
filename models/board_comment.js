const Sequelize = require("sequelize");

module.exports = class BoardComment extends Sequelize.Model {
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
                content:{
                    type:Sequelize.STRING(255),
                    allowNull:false,
                    defaultValue: '',
                    comment: '글쓴사람 이름(닉네임)'
                },
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: "BoardComment",
                tableName: "board_comment",
                paranoid: true,
                charset: "utf8",
                collate: "utf8_general_ci",
            }
        );
    }
    static associate(db) {
        db.BoardComment.belongsTo(db.Board,{foreignKey:'board_id',targetKey:'id'});
    }
};
