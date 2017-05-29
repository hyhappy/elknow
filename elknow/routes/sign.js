var express = require('express');
var router = express.Router();


router.get('/isAdmin', function(req, res, next) {
    let user = req.models.user, result;
    result = {
        status: -1,
        data: '',
        message: '用户未登录...'
    }
    if(req.session.user && req.session.user === req.query.name) {
        user.find({name: req.query.name}, function (err, User) {
            if(User.length !== 0) {
                result = {
                    status: 0,
                    message: '用户已登录...',
                    data: {
                        user_id: User[0].id,
                        name: User[0].name,
                        head_image: User[0].head_image,
                        admin: User[0].admin
                    }
                }
            }
            res.json(result);
        })
    } else {
        res.json(result);
    }
})

router.get('/isSign', function(req, res, next) {
    let user = req.models.user, result;
    result = {
        status: -1,
        data: '',
        message: '用户未登录...'
    }
    if(req.session.user && req.session.user === req.query.name) {
        user.find({name: req.query.name}, function (err, User) {
            if(User.length !== 0) {
                result = {
                    status: 0,
                    message: '用户已登录...',
                    data: {
                        user_id: User[0].id,
                        name: User[0].name,
                        head_image: User[0].head_image
                    }
                }
            }
            res.json(result);
        })
    } else {
        res.json(result);
    }
})

/* GET login page. */
router.post('/signin', function(req, res, next) {
    let user = req.models.user, result;
    let params = req.body, sqlParams;
    sqlParams = {
        name: params.userNameIn,
        password: params.passWordIn
    };
    user.find(sqlParams, function (err, User) {
        if(User.length !== 0) {
            result = {
                status: 0,
                data: User[0].name,
                message: ''
            }
            req.session.user = User[0].name;
        } else {
            result = {
                status: -1,
                data: '',
                message: '账号或者密码不正确...'
            }
        }
        res.json(result);
    });
});

router.post('/signup', function(req, res, next) {
    let user = req.models.user, result;
    let params = req.body, sqlParams;
    sqlParams = {
        name: params.userNameUp,
        password: params.passWordUp,
        admin: 0,
        head_image: 'images/head.jpg'
    };
    // 服务端判断
    if(params.passWordUp != params.passWordAgain) {
        result = {
            status: -1,
            data: '',
            message: '两次密码不一致...'
        }
        res.json(result);
    } else {
        user.find({name: sqlParams.name}, function (err, User) {
            if(User.length !== 0) {
                result = {
                    status: -1,
                    data: '',
                    message: '用户名已存在...'
                }
                res.json(result);
            } else {
                user.create([sqlParams], function(err, User) {
                    if(!err) {
                        result = {
                            status: 0,
                            message: '注册成功...',
                            data: ''
                        }
                        if(!!req.session.user) {
                            result.data = '';
                        } else {
                            result.data = User.name;
                            req.session.user = result.data;
                        }
                    }
                    res.json(result);
                })
            }

        });
    }
});

module.exports = router;
