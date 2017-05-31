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

router.get('/getUserLists', function(req, res, next) {
    let user = req.models.user, result;
    //没时间找orm2是否有方法来直接获取一个表的指定元素，当前方法是获取所有然后选取指定的值返回
    user.find({}, function(err, Users) { 
        let ret = [];
        if(err) {
            result = {
                status: -1,
                data: '',
                message: '查询出错...'
            }
        } else {
            Users.forEach((item, index) => {
                ret[index] = {
                    user_id: item.id,
                    name: item.name,
                    head_image: item.head_image,
                    admin: item.admin
                }
            })
            result = {
                status: 0,
                data: ret,
                message: '查询成功...'
            }
        }
        res.json(result);
    })
})


router.get('/authorityChange', function(req, res, next) {
    let user = req.models.user, result;
    if(!req.query.id || !req.query.admin) {
        result = {
            status: -1,
            message: '缺少参数，更新失败...',
            data: ''
        }
        res.json(result);
    } else {
        user.find({id: req.query.id, admin: req.query.admin}, function(err, User) {
            if(User.length === 0) {
                result = {
                    status: -1,
                    message: '没有此用户...',
                    data: ''
                }
            } else {
                User[0].admin = (+req.query.admin === 1?0:1);
                User[0].save(function(e) {
                    result = {
                        status: 0,
                        message: '更新用户权限成功...',
                        data: User[0].admin
                    }
                    res.json(result);
                });      
            }
        })
    }
})

module.exports = router;
