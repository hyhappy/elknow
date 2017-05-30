import React, {Component} from 'react';
import { Icon, Button, message } from 'antd';
import Nav from '../common/nav.js';
import Comment from '../common/comment.js';
import $ from 'jquery';
import util from '../util/util.js';
import isSign from '../util/sign.js';

import '../../styles/knowledge.css';

class Knowledge extends Component {
    constructor() {
        super();
        this.state = {
            knowInfo: {

            },
            user: {
                head_image: '//127.0.0.1:8000/images/default.png'
            },
            isCollected: false
        }
    }
    componentDidMount() {
        let { match } = this.props;
        if(!match || isNaN(match.params.id)) {
            message.error('文章不存在...', 2, () => {
                location = '/';
            });
            return;
        }
        $.ajax({
            url: '//127.0.0.1:8000/knows/getKnowInfo',
            type: 'get',
            xhrFields:{withCredentials:true},
            dataType: 'json',
            data: {
                id: match.params.id
            },
            success: res => {
                if(res.status === 0) {
                    // 格式化日期
                    res.data.create_time = util.dateFromat(
                        new Date(res.data.create_time), 'yyyy-MM-dd hh:mm:ss');
                    this.setState({
                        knowInfo: res.data
                    })
                } else {
                    message.error('文章获取失败...', 2, () => {
                        location = '/';
                    });
                }
            }
        })
        // 获取用户信息
        isSign.handleUserInfoGetNoSign.bind(this)();
    }

    handleCollectClick() {
        if(!this.state.user.name) {
            message.error('请登录之后再收藏...', 2);
            return;
        }
        $.ajax({
            url: '//127.0.0.1:8000/knows/collect',
            type: 'get',
            xhrFields:{withCredentials:true},
            dataType: 'json',
            data: {
                user_id: this.state.user.user_id,
                know_id: this.state.knowInfo.id
            },
            success: res => {
                if(res.status === 0) {
                    message.success(res.message, 2);
                    this.setState({
                        isCollected: true
                    })
                } else{
                    message.error(res.message, 2);
                }
            }
        })
    }

    render() {
        return (
            <div className="know">
                <Nav user={this.state.user.name}/>
                <div className="know-info">
                    <header className="know-header">
                        <h1 className="know-title">
                            {this.state.knowInfo.title}
                        </h1>
                        <div className="know-meta">
                            <span className="know-time">
                                发表于&nbsp;{this.state.knowInfo.create_time}
                            </span>
                            <span className="know-author">
                                &nbsp; | &nbsp; by &nbsp;{this.state.knowInfo.name}
                            </span>
                            <span className="know-classify">
                                &nbsp; | &nbsp; 分类于 &nbsp;
                                <span>{this.state.knowInfo.classifys}</span>
                            </span>
                        </div>
                    </header>
                    <div className="know-content" dangerouslySetInnerHTML={{__html: this.state.knowInfo.content}}>
                    </div>
                    <div className="know-action">
                        <div className="know-collect">
                            <Button disabled={this.state.isCollected}
                                onClick={this.handleCollectClick.bind(this)}>
                                <Icon type="star-o"/>{this.state.isCollected?'已经收藏':'收藏'}</Button>
                        </div>
                        <Comment user={this.state.user} know_id={this.props.match.params.id}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Knowledge;
