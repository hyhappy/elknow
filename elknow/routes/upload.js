var express = require('express');
var path = require('path');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var util = require('util');

// 文件将要上传到哪个文件夹下面
var uploadfoldername = 'images';
var uploadfolderpath = process.cwd() + '\\public\\' + uploadfoldername;


var server = '127.0.0.1';
var port = 8000;

router.post('/', function(req, res, next) {

    var form = new formidable.IncomingForm();
    // 处理 request
    form.parse(req, function (err, fields, files) {
        if (err) {
            return console.log('formidable, form.parse err');
        }

        var item;

        // 计算 files 长度
        var length = 0;
        for (item in files) {
            length++;
        }

        if (length === 0) {
            console.log('files no data');
            return;
        }

        for (item in files) {
            var file = files[item];
            // formidable 会将上传的文件存储为一个临时文件，现在获取这个文件的目录
            var tempfilepath = file.path;
            // 获取文件类型
            var type = file.type;

            // 获取文件名，并根据文件名获取扩展名
            var filename = file.name;
            var extname = filename.lastIndexOf('.') >= 0
                            ? filename.slice(filename.lastIndexOf('.') - filename.length)
                            : '';
            // 文件名没有扩展名时候，则从文件类型中取扩展名
            if (extname === '' && type.indexOf('/') >= 0) {
                extname = '.' + type.split('/')[1];
            }
            // 将文件名重新赋值为一个随机数（避免文件重名）
            filename = Math.random().toString().slice(2) + extname;

            // 构建将要存储的文件的路径
            var filenewpath = uploadfolderpath + '\\' + filename;

            var is = fs.createReadStream(tempfilepath);
            var os = fs.createWriteStream(filenewpath);

            is.pipe(os);
            is.on('end',function() {
                fs.unlinkSync(tempfilepath);

                var result = '';

                if (err) {
                    // 发生错误
                    result = 'error|save error';
                } else {

                    // 拼接图片url地址
                    result = 'http://' + server + ':' + port + '/' + uploadfoldername + '/' + filename;
                }

                // // 返回结果
                // res.writeHead(200, {
                //     'Content-type': 'application/json'
                // });
                res.end(result);
            });
        } // for in
    });
});


module.exports = router;
