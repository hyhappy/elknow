var express = require('express');
var router = express.Router();


router.post('/save', function(req, res, next) {
    let knows = req.models.knows,
        params = req.body, result,
        query = req.query.id;

    // 默认值
    params.collect_counts = 0;
    params.comment_counts = 0;
    params.read_counts = 0;
    if(!!query) {
        knows.find({id: +query}, function(err, Knows) {
            if(err || Knows.length === 0 ) {
                result = {
                    status: -1,
                    data: '',
                    message: '更新文章失败...'
                }
                res.json(result);
            } else {
                Knows[0].title = params.title;
                Knows[0].classify = params.classify;
                Knows[0].classifys = params.classifys;
                Knows[0].abstract = params.abstract;
                Knows[0].content = params.content;
                Knows[0].save(function(err) {
                    result = {
                        status: 0,
                        data: {
                            id: Knows[0].id
                        },
                        message: '创建成功...'
                    }
                    res.json(result);
                });
            }
        })
    } else {
        knows.create([params], function(err, Knows) {
            if(err) {
                result = {
                    status: -1,
                    data: '',
                    message: '创建文章失败...'
                }
            } else {
                result = {
                    status: 0,
                    data: {
                        id: Knows[0].id
                    },
                    message: '创建成功...'
                }
            }
            res.json(result);
        })
    }
})

router.get('/delete', function(req, res, next) {
    let knows = req.models.knows, comment = req.models.comment;
    let params = req.query.id, result;
    knows.find({id: +params}, function (err, Knows) {
        if(err || Knows.length === 0) {
            result = {
                status: -1,
                data: '',
                message: '删除文章失败...'
            }
            res.json(result);
        } else {
            Knows[0].remove(function (err) {
                if(err) {
                    result = {
                        status: -1,
                        data: '',
                        message: '删除文章失败...'
                    }
                } else {
                    result = {
                        status: 0,
                        data: Knows[0].title,
                        message: '删除成功...'
                    }
                }
                res.json(result);
        	});
        }
    });
    // 删除文章的时候，应该是无需删除该文章对应的评论，收藏记录等，用户那儿应该还是有记录的，只不过
    // 在点击文章的时候提示文章已经不存在
    // comment.find({know_id: +params}, function (err, Comments) {
    //     Comments.forEach(item => {
    //         item.remove();
    //     })
    // });
})

router.get('/getUsersKnowList', function(req, res, next) {
    let knows = req.models.knows;
    let params = req.query.id, result;
    if(!params) {
        result = {
            status: -1,
            data: '',
            message: '无用户id...'
        }
        res.json(result);
    }  else {
        knows.find({user_id: params}, function(err, Knows) {
            if(err) {
                result = {
                    status: -1,
                    data: '',
                    message: '获取用户文章失败...'
                }
            } else {
                result = {
                    status: 0,
                    data: Knows, // 没有进行处理，将所有的信息全部返回了
                    message: '获取成功...'
                }
            }
            res.json(result);
        })
    }
})

router.get('/getKnowInfo', function(req, res, next) {
    let db = req.models.db, result, knows = req.models.knows;
    if(!req.query.id) {
        result = {
            status: -1,
            message: '缺少文章id，获取文章失败...',
            data: ''
        }
        res.json(result);
    } else {
        // 阅读次数加一
        knows.find({id: req.query.id}, function(err, Knows) {
            Knows[0].read_counts++;
            Knows[0].save();
        })
        db.driver.execQuery("select k.*, u.name, u.head_image from user u inner join knowledge " +
            "k on u.id = k.user_id where k.id = " + req.query.id,
            function (err, data) {
                if(err || !data || (data && data.length === 0)) {
                    result = {
                        status: -1,
                        message: '文章id错误，获取文章失败...',
                        data: ''
                    }
                } else {
                    result = {
                        status: 0,
                        message: '获取文章成功...',
                        data: data[0]
                    }
                    result.data.content = result.data.content.toString('utf8');
                }
                res.json(result);
            }
        )
    }
})

// 这个是带查询，带分类，带分页的查询，下面那个是查询所有的文章，暂时没有带分页
router.get('/getKnowList', function(req, res, next) {
    let db = req.models.db, params = req.query, result;
    let pageSize = params.pageSize || 10, page = params.page, classify = params.classify,
        query = params.query;
    db.driver.execQuery("select k.*, u.name,u.head_image from user u inner join knowledge k " +
    "on u.id = k.user_id WHERE k.classify LIKE '" + classify + "%' and " +
    "(abstract like '%" + query + "%' or title like '%" + query + "%' or classifys like '%" + query + "%')" +
    "ORDER BY k.create_time DESC LIMIT "+ (page-1)*pageSize + "," + pageSize,
        function (err, data) {
            if(err || !data) {
                result = {
                    status: -1,
                    message: '查询有误，获取列表失败...',
                    data: ''
                }
                res.json(result);
            } else {
                result = {
                    status: 0,
                    message: '获取文章成功...',
                    data: {
                        knows: data,
                        page: +page,
                        pageSize: +pageSize
                    }
                }
                result.data.knows.forEach((item) => {
                    item.content = null;
                })
                db.driver.execQuery("select count(*) total from user u inner join knowledge k " +
                "on u.id = k.user_id WHERE k.classify LIKE '" + classify + "%' and " +
                "(abstract like '%" + query + "%' or title like '%" + query +
                "%' or classifys like '%" + query + "%')", (err, data) => {
                    if(!err && data && data.length !== 0) {
                        result.data.total = data[0].total;
                    }
                    res.json(result);
                })
            }
        }
    )
})

router.get('/getHotKnowList', function(req, res, next) {
    let knows = req.models.knows, result;
    let db = req.models.db, params = req.query;
    let pageSize = params.pageSize, page = params.page;
    db.driver.execQuery("select k.id, k.user_id, k.title, k.read_counts, k.comment_counts, k.collect_counts, " +
    "u.name from user u inner join knowledge k " +
    "on u.id = k.user_id ORDER BY k.read_counts + k.comment_counts*2 + k.collect_counts*3 DESC LIMIT "
    + (page-1)*pageSize + "," + pageSize,
        function (err, data) {
            if(err || !data) {
                result = {
                    status: -1,
                    message: '查询有误，获取列表失败...',
                    data: ''
                }
                res.json(result);
            } else {
                result = {
                    status: 0,
                    message: '获取文章成功...',
                    data: {
                        knows: data,
                        page: +page,
                        pageSize: +pageSize
                    }
                }
                knows.count({ }, function (err, count) {
                	result.data.total = count;
                    res.json(result);
                });
            }
        }
    )
})

router.get('/collect', function(req, res, next) {
    let knows = req.models.knows, collect = req.models.collect, result;
    let user_id = req.query.user_id, know_id = req.query.know_id;
    if(!user_id || !know_id) {
        result = {
            status: -1,
            message: '缺少文章或者用户id，收藏失败...',
            data: ''
        }
        res.json(result);
    } else {
        collect.find(req.query, function(err, collects) {
            if(collects.length !== 0) {
                result = {
                    status: 0,
                    message: '已经收藏过该文章...',
                    data: ''
                }
                res.json(result);
            } else {
                knows.find({id: know_id}, function(err, Knows) {
                    Knows[0].collect_counts++;
                    Knows[0].save();
                });
                collect.create([req.query], function(err, Collects) {
                    if(err) {
                        result = {
                            status: -1,
                            data: err,
                            message: '收藏文章失败...'
                        }
                    } else {
                        result = {
                            status: 0,
                            data: '',
                            message: '收藏成功...'
                        }
                    }
                    res.json(result);
                })
            }
        })
    }
})

router.get('/getUsersCollectList', function(req, res, next) {
    let db = req.models.db;
    let params = req.query.id, result;
    if(!params) {
        result = {
            status: -1,
            data: '',
            message: '无用户id...'
        }
        res.json(result);
    }  else {
        db.driver.execQuery("select k.* from collect c inner join knowledge k " +
            "on c.know_id = k.id and c.user_id = " + params,
            function (err, data) {
                if(err) {
                    result = {
                        status: -1,
                        data: '',
                        message: '获取用户收藏失败...'
                    }
                } else {
                    result = {
                        status: 0,
                        data: data, // 没有进行处理，将所有的信息全部返回了
                        message: '获取成功...'
                    }
                }
                res.json(result);
            }
        )
    }
})

// 区别于上面那个
router.get('/getKnowLists', function(req, res, next) {
    let knows = req.models.knows, result;
    knows.find({}, function(err, Knows) {
        if(err) {
            result = {
                status: -1,
                data: '',
                message: '查询出错...'
            }
        } else {
            result = {
                status: 0,
                data: Knows,
                message: '查询成功...'
            }
        }
        res.json(result);
    })
})

module.exports = router;
