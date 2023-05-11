const Sequelize = require("sequelize");

module.exports = class BoardFile extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                file_no:{
                  type:Sequelize.INTEGER,
                  allowNull:false,
                  defaultValue:1,
                  comment:'파일번호'
                },
                board_file:{
                    type:Sequelize.STRING(200),
                    allowNull:false,
                    defaultValue:'N',
                    comment:'파일명'
                }
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: "BoardFile",
                tableName: "board_file",
                paranoid: true,
                charset: "utf8",
                collate: "utf8_general_ci",
            }
        );
    }

    static associate(db) {
        db.BoardFile.belongsTo(db.Board,{foreignKey:'board_id',targetKey:'id'});

    }
};
