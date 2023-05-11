const express = require("express"); //익스프레스 모듈 가져오기
const cors = require('cors');
const morgan = require("morgan"); //로그를 기록하기 위한 모듈
const cookieParser = require("cookie-parser"); //쿠키를 굽는 모듈
const session = require("express-session"); //세션 인식 모듈
const dotenv = require("dotenv"); //키값을 지정하는 모듈
const path = require("path"); //경로 모듈 가져오기
const fs = require("fs");
const { sequelize } = require("./models");
const webSocket = require('./socket');
const passport = require("passport");
const userRouter = require('./routes/user');
const boardRouter = require('./routes/board');
const commentRouter = require('./routes/comment');
const passportConfig = require("./passport");
dotenv.config(); ////키값을 가져오는 기본 설정
try {
  fs.readdirSync("uploads"); //uploads 디렉토리 가져오기
  fs.readdirSync("uploads/group"); //uploads 디렉토리 가져오기
} catch (error) {
  console.error("uplaods 디렉토리가 없어 uploads 디렉토리를 생성합니다.");
  fs.mkdirSync("uploads");
  fs.mkdirSync("uploads/group");
}


const app = express(); //익스프레스를 사용

app.set("port", process.env.PORT || 3060); // 포트 번호 설정 process.env파일에 PORT를 가져오거나 또는 3000번 포트로 설정
//앱과 데이터베이스 연결
sequelize
    .sync({ force: false })
    .then(() => {
      console.log("db 연결 성공");
    })
    .catch((err) => {
      console.log(err);
    });

passportConfig(); // 패스포트 설정




// 어떤 api나 또는 모듈에 필요한 키값을 가져오기 위함
app.use("/", express.static(path.join(__dirname, "public"))); // /public을 url주소 /로 해도 바로 접근이 가능하게
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); //파일첨부 디렉토리 설정

app.use(express.urlencoded({ extended: false })); //url 인코드를 사용하지 않겠다.
app.use(express.json()); //json을 사용한다
app.use(cookieParser(process.env.COOKIE_SECRET)); //쿠키를 암호화해서 파싱하기
if (process.env.NODE_ENV === 'production') {
  const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
  console.log("production");
  app.use(morgan('combined'));
  app.use(cors(corsOptions));
} else {
  console.log("개발자용");
  console.log('development');
  app.use(morgan('dev'));
  app.use(cors({
    origin: ["http://localhost:3060","http://172.24.6.131:3060","http://13.125.226.19","app://."],
    credentials: true,
  }));
}
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true, //쿠키는 http 프로토콜에서만 쓰겠다 =>클라이언트에서 확인 못함
    secure: false, //보안처리 하지 않겠다 => https로 사용할 때는 반드시 true
  },
}));
app.use(passport.initialize()); //패스포트 초기 설정
app.use(passport.session()); //패스포트 세션 설정

app.use('/user',userRouter);
app.use('/board',boardRouter);
app.use('/comment',commentRouter);

app.use((req, res, next) => {
  console.log("모든 요청에 다 실행됩니다.");
  next(); //다음 미들웨어에 검수하기
});
//최종적으로 오류가 발생하면 메세지 보여주기
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message); //500번 오류 메세지 보여주기
});

const server=app.listen(app.get("port"), () => {
  //기본 포트는 3000번
  console.log(app.get("port"), "번 포트에서 대기중");
});
//webSocket(server,app);