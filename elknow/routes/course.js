var express = require('express');
var router = express.Router();


router.post('/save', function(req, res, next) {
    let course = req.models.course,
        params = req.body, result;  
    course.create([params], function(err, Course) {
    	console.log(err)
        if(err) {
            result = {
                status: -1,
                data: '',
                message: '创建知识失败...'
            }
        } else {
            result = {
                status: 0,
                data: {
                    id: Course[0].id
                },
                message: '创建成功...'
            }
        }
        res.json(result);
    })
})

router.get('/courseList', function(req, res, next) {
	let course = req.models.course, result;
	let page = req.query.page, pageSize = req.query.pageSize;
	course.find({isOnline: '1', type: '1'}).limit(page*pageSize).offset((page-1)*pageSize).run(function(err, Courses) {
		if(err) {
			result = {
				status: -1,
				data: '',
				message: '获取课程列表的时候失败...'
			}
			res.json(result);
		} else {
			course.find({type: '1'}).count(function(err, Num) {
				result = {
					status: 0,
					data: {
						courseList: Courses,
						total: Num
					},
					message: '获取课程列表的时候成功...'
				}
				res.json(result);
			})
		}
		
	})  
})

router.get('/activityList', function(req, res, next) {
	let course = req.models.course, result;
	let page = req.query.page, pageSize = req.query.pageSize;
	course.find({isOnline: '1', type: '2'}).limit(page*pageSize).offset((page-1)*pageSize).run(function(err, Courses) {
		if(err) {
			result = {
				status: -1,
				data: '',
				message: '获取活动列表的时候失败...'
			}
			res.json(result);
		} else {
			course.find({type: '2'}).count(function(err, Num) {
				result = {
					status: 0,
					data: {
						activityList: Courses,
						total: Num
					},
					message: '获取活动列表的时候成功...'
				}
				res.json(result);
			})
		}
	})  
})

router.get('/courseInfo', function(req, res, next) {
	let course = req.models.course, result;
	if(!req.query.id) {
		result = {
			status: -1,
			data: '',
			message: '缺少参数id...'
		}
		res.json(result);
	} else {
		course.find({isOnline: '1', id: req.query.id}, function(err, Courses) {
			if(err || (Courses&&Courses.length === 0)) {
				result = {
					status: -1,
					data: '',
					message: '获取详情失败...'
				}
			} else {
				result = {
					status: 0,
					data: Courses[0],
					message: '获取详情成功...'
				}
			}
			res.json(result);
		})  
	}
	
})
module.exports = router;