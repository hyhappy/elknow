var express = require('express');
var router = express.Router();


router.get('/delete', function(req, res, next) {
    let collect = req.models.collect, result;
    if(!req.query.user_id || !req.query.know_id) {
        result = {
            status: -1,
            message: '缺少用户或者文章id，删除失败...',
            data: ''
        }
        res.json(result);
    } else {
        collect.find({
            user_id: +req.query.user_id,
            know_id: +req.query.know_id
        }, function(err, Collects) {
            if(err || Collects.length === 0) {
                result = {
                    status: -1,
                    message: '删除收藏失败...',
                    data: ''
                }
                res.json(result);
            } else {
                Collects[0].remove(function (err) {
                    if(err) {
                        result = {
                            status: -1,
                            data: '',
                            message: '删除收藏失败...'
                        }
                    } else {
                        result = {
                            status: 0,
                            data: '',
                            message: '删除成功...'
                        }
                    }
                    res.json(result);
            	});
            }
        })
    }
})
module.exports = router;
