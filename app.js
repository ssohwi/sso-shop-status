// https://miryang.dev/2019/04/02/nodejs-page-1/
// Express 기본 모듈 불러오기
var express = require('express'),
    path = require('path');

// Express의 미들웨어 불러오기
var cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    bodyParser = require("body-parser"),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Session = require('express-session'),
    flash = require('connect-flash'),
    MongoDBStore = require('connect-mongodb-session')(Session),
    mongoose = require("mongoose");

// Route 분리
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Express 객체 생성
var app = express();

// 로그 파일로 저장하기
app.use(logger('dev'));

// application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }));

// application/json 파싱
app.use(bodyParser.json());

// cookie-parser 설정
app.use(cookieParser());

// 뷰엔진 설정
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// 데이터베이스 연결
var dbUrl = "mongodb://localhost:27017/users";

mongoose
    .connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log("MongoDB Connected!"))
    .catch((err) => console.log(err));

// 로그인 기능
app.use(flash());
// 세션
var store = new MongoDBStore({ // 세션을 저장할 공간
   url: dbUrl, // 데이터베이스 url
   collection: 'sessions' // 콜렉션 이름
});

store.on('error', (error) => {
    console.log(error);
});

app.use(Session({
    secret: 'dalhav', // 세션 암호화 key
    resave:false, // 세션 재저장 여부
    saveUninitialized: true,
    rolling: true, // 로그인 상태에서 페이지 이동 시마다 세션값 변경 여부
    cookie: {maxAge:1000*60*60}, // 유효시간
    store: store
}));

app.use(passport.initialize());
app.use(passport.session());

// 라우터 객체 등록
app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;