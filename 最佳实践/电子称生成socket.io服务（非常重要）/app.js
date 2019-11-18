
var http = require('http');   //引入http模块
var express = require('express'); //引入express模块
var app = express();  //创建express实例
var path = require('path');  //引入path模块
var fs = require('fs');  //引入fs模块
var multer = require('multer');
var upload = multer({ dest: '../public/jsondata/' });
console.log('请在浏览器中访问http://localhost:2212/');
if ((typeof sp) != 'undefined') {
    sp.setMaxListeners(20);
}

app.use(express.static(path.join(__dirname, 'public'))); //设置public文件夹为静态资源文件夹,必须建立否则js和css无法加载
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});   //设置路由，当客户端请求'/'时，发送文件command.html
app.post('/index.html', function (req, res) {
    req.on("data", function (data) {
        res.send(data);
    });
});
app.post('/readJson', upload.single('file'), function (req, res, next) {
    var file = req.file;
    fs.readFile(file.path, 'utf8', function (err, data) {
        res.json(data);
    });
})



module.exports = app;