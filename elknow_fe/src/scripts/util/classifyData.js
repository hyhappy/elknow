// 时间原因，没有将分类存数据库，并且只有两级分类
// 方便点开发，之后应该也不看这个项目了，如果有机会扩展一下
const classify = [
    {
        value: 1,
        label: '前端开发',
        children: [
            {
                value: 100,
                label: 'html',
                //children: []
            }, {
                value: 101,
                label: 'css',
                //children: []
            }, {
                value: 102,
                label: 'javascript',
                //children: []
            }
        ]
    }, {
        value: 2,
        label: '数据库开发',
        children: [
            {
                value: 200,
                label: 'mysql',
                //children: []
            }, {
                value: 201,
                label: 'nosql',
                //children: []
            }
        ]
    }, {
        value: 3,
        label: '移动开发',
        children: [
            {
                value: 300,
                label: 'android',
                //children: []
            }, {
                value: 301,
                label: 'ios',
                //children: []
            }, {
                value: 302,
                label: 'react native',
                //children: []
            }
        ]
    }, {
        value: 4,
        label: '后端开发',
        children: [
            {
                value: 400,
                label: 'nodejs',
                //children: []
            }, {
                value: 401,
                label: 'php',
                //children: []
            }, {
                value: 402,
                label: 'java',
                //children: []
            }
        ]
    }, {
        value: 5,
        label: '其他技术',
        children: [
            {
                value: 500,
                label: '测试相关',
                //children: []
            }, {
                value: 501,
                label: '大数据',
                //children: []
            }, {
                value: 502,
                label: 'ui设计',
                //children: []
            }
        ]
    }, {
        value: 6,
        label: '其他',
        children: [
            {
                value: 600,
                label: '随笔',
                //children: []
            }, {
                value: 601,
                label: '生活',
                //children: []
            }, {
                value: 602,
                label: '随便',
                //children: []
            }
        ]
    }, {
        value: 7,
        label: '全部',
        children: []
    }
]

export default classify;
