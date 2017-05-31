import cookie from 'cookie';
import { message } from 'antd';
import $ from 'jquery';


const isSign = {
    // 必须强制登录
    handleUserInfoGet() {
        // 用户是否登录
        let user = cookie.parse(document.cookie).user;
        if(!user) {
            message.error('你还没有登录，请先登录...', 2, () => {
                location.href = '/sign_up';
            });
            return;
        }
        $.ajax({
            url: '//127.0.0.1:8000/sign/isSign',
            type: 'get',
            xhrFields:{withCredentials:true},
            //contentType: 'application/json',
            dataType: 'json',
            data: {
                name: user
            },
            success: res => {
                if(res.status === 0) {
                    this.setState({
                        user: res.data
                    })
                } else {
                    message.error('你还没有登录，请先登录...', 2, () => {
                        location.href = '/sign_up';
                    });
                }
            }
        })
    },
    // 无需强制登录，只获取信息
    handleUserInfoGetNoSign() {
        // 用户是否登录
        let user = cookie.parse(document.cookie).user;
        if(!user) {
            return;
        }
        $.ajax({
            url: '//127.0.0.1:8000/sign/isSign',
            type: 'get',
            xhrFields:{withCredentials:true},
            dataType: 'json',
            data: {
                name: user
            },
            success: res => {
                if(res.status === 0) {
                    this.setState({
                        user: res.data
                    })
                }
            }
        })
    },
    handleUserInfoShow(user) {
        $.ajax({
            url: '//127.0.0.1:8000/sign/isSign',
            type: 'get',
            xhrFields:{withCredentials:true},
            //contentType: 'application/json',
            dataType: 'json',
            data: {name: user},
            success: res => {
                if(res.status === 0) {
                    location.href = '/users/' + res.data.user_id
                } else {
                    message.error('你已经失去登录状态，请先登录...', 2, () => {
                        location.href = '/sign_up';
                    });
                }
            }
        })
    },
    // 获取用户信息包括是否是管理员
    handleUserIsAdmin(mustAdmin) {
        let user = cookie.parse(document.cookie).user;
        if(!user) {
            message.error('你还没有登录，请先登录...', 1, () => {
                location.href = '/sign_up';
            });
            return;
        }
        $.ajax({
            url: '//127.0.0.1:8000/sign/isAdmin',
            type: 'get',
            xhrFields:{withCredentials:true},
            //contentType: 'application/json',
            dataType: 'json',
            data: {
                name: user
            },
            success: res => {
                if(res.status === 0) {
                    this.setState({
                        user: res.data
                    }, mustAdmin)
                } else {
                    message.error('你还没有登录，请先登录...', 2, () => {
                        location.href = '/sign_up';
                    });
                }
            }
        })
    },
}

export default isSign;
