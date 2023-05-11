const Sequelize = require("sequelize");
const User = require("./user");//회원 테이블
const Board = require('./board');//게시판 테이블
const BoardComment = require('./board_comment');//게시판 댓글 테이블
const BoardFile = require('./board_file');//게시판 파일 테이블

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env]; //db정보가 있는 곳
const db = {}; //db 테이블을 객체로 받는 곳

const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User; //db 모델명 설정
db.Board = Board;
db.BoardFile = BoardFile;
db.BoardComment = BoardComment;

User.init(sequelize);//테이블 생성하기
Board.init(sequelize);
BoardFile.init(sequelize);
BoardComment.init(sequelize);

User.associate(db);//관계 맺기
Board.associate(db);
BoardFile.associate(db);
BoardComment.associate(db);



module.exports = db; //db 모듈을 내보내기
