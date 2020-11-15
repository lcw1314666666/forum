//session 路由模块 处理登录、注册等

var express = require('express')
var User = require('../models/user')
// var crypto = require('../node_modules/crypto');
var md5 = require('md5-node')



var router = express.Router()

router.get('/', function (req, res, next) {
    console.log(req.session.user)
    res.render('index.html', {
        user: req.session.user
    })
})

//渲染注册页面
router.get('/register', function (req, res, next) {
    res.render('register.html', {})
})

//处理注册请求

router.post('/register', function (req, res, next) {
    //获取post请求体 console.log(req.body)
    var body = req.body
    //存入数据库
    User.findOne({
        $or: [
            {
                email: body.email
            },{
                nickname: body.nickname
            } 
        ]
    }, function (err, data) {
        if (err) {
            //服务器错误
            return next(err)
        }
        if (data) {
            //邮箱或昵称已存在
            return res.status(200).json({
                err_code: 1,
                message: 'email or nickname already exists'
            })
        }

        //可以注册
        body.password = md5(md5(body.password))
        new User(body).save(function (err, body) {
            if (err) {
                next(err)
            }
            req.session.user = body
            res.status(200).json({
                err_code: 0,
                message: 'Ok'
            })
        })

    })
})

//处理登录页面
router.get('/login', function (req, res, next) {
    res.render('login.html')
})

//处理登录请求
router.post('/login', function (req, res, next) {
    //获取登录post请求体
    //查询数据库
    //发出响应
    var body = req.body

    User.findOne({
        email: body.email,
        password: md5(md5(body.password))
    }, function (err, user) {

        if (err) {
           return next(err)
        }

        if (!user) {
            return res.status(200).json({
                err_code: 1,
                message: 'Email or password is invaild'
            })
        }

        req.session.user = user
        res.status(200).json({
            err_code: 0,
            message: 'Ok'
        })
    })
})

// 处理退出请求
router.get('/logout', function (req, res, next) {
    //清除缓存
    req.session.user = null

    //重定向
    res.redirect('/')
})


module.exports = router