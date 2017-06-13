var express = require('express');
var router = express.Router();

// 大量嵌套的异步操作，时间紧迫没有进行处理
router.post('/save', function(req, res, next) {
    let comment = req.models.comment, user = req.models.user;
    let knows = req.models.knows;
    let params = req.body, result;
    if(params.parent_id === '') {
        params.parent_id = 1
    }
    comment.create([params], function(err, Comments) {
        if(err) {
            result = {
                status: -1,
                data: '',
                message: '评论失败...'
            }
        } else {
            result = {
                status: 0,
                data: Comments[0],
                message: '评论成功...'
            }
            user.find({id: Comments[0].user_id}, function(err, Users) {
                result.data.user = {
                    user_id: Users[0].id,
                    name: Users[0].name,
                    head_image: Users[0].head_image
                }
                res.json(result);
            })
            knows.find({id: Comments[0].know_id}, function(err, Knows) {
                Knows[0].comment_counts++;
                Knows[0].save();
            })
        }
    })
})

// 暂时没有进行分页
router.get('/getComments', function(req, res, next) {
    let db = req.models.db;
    let know_id = req.query.know_id, result;
    db.driver.execQuery("select u.name, u.head_image, u.id user_id, c.* from user u " +
        "inner JOIN comment c on u.id = c.user_id where c.know_id = " + know_id,
        function(err, data) {
            if(err) {
                result = {
                    status: -1,
                    message: '查询出错...',
                    data: ''
                }
                res.json(result);
            } else {
                let comments = data.map(item => {
                    return {
                        id: item.id,
                        content: item.content,
                        parent_id: item.parent_id,
                        know_id: item.know_id,
                        create_time: item.create_time,
                        user: {
                            user_id: item.user_id,
                            name: item.name,
                            head_image: item.head_image
                        },
                        children: []
                    }
                }), ret = [];
                comments.forEach(item => {
                    if(item.parent_id === 1) {
                        ret.push(item);
                    }
                })
                comments.forEach((item, index) => {
                    if(item.parent_id !== 1) {
                        ret.forEach(item2 => {
                            if(item2.id === item.parent_id) {
                                item2.children.push(item);
                            }
                        })
                    }
                })
                result = {
                    status: 0,
                    message: '查询成功...',
                    data: {
                        total: comments.length,
                        comments: ret
                    }
                }
                res.json(result);
            }
        }
    )
})

module.exports = router;
