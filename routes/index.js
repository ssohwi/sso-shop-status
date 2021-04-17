var express = require('express');
var router = express.Router();
const User = require("../models/user");
const mongoose = require("mongoose");
const crypto = require("crypto");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


router.get('/', (req, res, next) => {
    res.render('index', {email: req.flash('email')});
});
router.get('/login', (req, res, next) => {
    res.render('login', {message: req.flash('login_message')});
});
router.get('/signup', (req, res, next) => {
    res.render('signup', {page: 'signup'});
});


// 회원가입 기능
// body에서 form값을 가져와 데이터베이스에 저장
router.post("/signup", (req, res, next) => {
    console.log(req.body);
    // email 중복 확인
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length >= 1) {
                res.send('<script type="text/javascript">alert("이미존재하는 이메일입니다."); window.location="/signup"; </script>')
            } else {
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    email: req.body.email,
                    password: crypto.createHash('sha512').update(req.body.password).digest('base64')
                });
                user
                    .save()
                    .then(result => {
                        console.log(result);
                        res.redirect("/");
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        });
});


// 로그인 기능
// 로그인 성공 시 serializeUser 메서드를 통해서 사용자 정보를 세션에 저장
passport.serializeUser((user, done) => {
    done(null, user);
});

// 사용자 인증 후 요청이 있을 때마다 호출
passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(new LocalStrategy({
        // 파라미터 등록
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true//request callback 여부
    },
    (req, email, password, done) => {
        User.findOne({
            email: email,
            password: crypto.createHash('sha512').update(password).digest('base64')
        }, (err, user) => {
            if (err) {
                throw err;
            } else if (!user) {
                return done(null, false, req.flash('login_message', '이메일 또는 비밀번호를 확인하세요.')); // 로그인 실패
            } else {
                return done(null, user, req.flash('email', email));
            }
        });
    }
));

router.post('/login',
    passport.authenticate(
        'local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        }));


// 로그아웃 기능
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
