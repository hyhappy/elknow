var express = require('express');
var router = express.Router();


router.get('/getUserInfo', function(req, res, next) {
    let user = req.models.user, result;
    if(!req.query.id) {
        result = {
            status: -1,
            message: '缺少用户id，获取用户信息失败...',
            data: ''
        }
        res.json(result);
    } else {
        user.find({id: req.query.id}, function(err, User) {
            if(User.length === 0) {
                result = {
                    status: -1,
                    message: '没有此用户...',
                    data: ''
                }
            } else {
                result = {
                    status: 0,
                    message: '查询用户成功...',
                    data: {
                        user_id: User[0].id,
                        name: User[0].name,
                        head_image: User[0].head_image,
                    }
                }
            }
            res.json(result);
        })
    }
})

router.get('/updateImage', function(req, res, next) {
    let user = req.models.user, result;
    if(!req.query.id) {
        result = {
            status: -1,
            message: '缺少用户id，更新失败...',
            data: ''
        }
        res.json(result);
    } else {
        user.find({id: req.query.id}, function(err, User) {
            if(User.length === 0) {
                result = {
                    status: -1,
                    message: '没有此用户...',
                    data: ''
                }
            } else {
                User[0].head_image = req.query.head_image;
                User[0].save(function(e) {
                    result = {
                        status: 0,
                        message: '更新头像成功...',
                        data: {
                            head_image: User[0].head_image,
                        }
                    }
                    res.json(result);
                });      
            }
        })
    }
})
module.exports = router;
