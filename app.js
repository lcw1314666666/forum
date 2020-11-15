var express = require('express')
var path = require('path')
var sessionRouter = require('./routes/session.js')
var bodyParser = require('body-parser')
var session = require('express-session')
// var template = require('art-template')


var app = express()

//开放公共文件
app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))


//配置express-art-template工具包
app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views'))

//配置body-parser工具包，获取post请求数据
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//配置 express-session 中间件
app.use(session({
    //配置加密字符串，在原有的加密基础上和这个字符串拼接加密
    //增加安全性
    secret: "keyboard cat",
     resave: false,
     saveUninitialized: true,
     cookie: ('name', 'value',{maxAge:  5*60*1000,secure: false})
     //无论你是否使用session服务器都会给你分配一把钥匙
}));

app.use(sessionRouter)


app.use(function (req, res, next) {
    res.render('404.html')
})

app.use(function (err, req, res, next) {
    res.status(500).join({
        err_code: 500,
        message: err.message
    })
})

app.listen(3000, function () {
    console.log('127.0.0.1:3000/')
})