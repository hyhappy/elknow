import React, {Component} from 'react';
import { Icon, Input, Button, message} from 'antd';
import util from '../util/util.js';
import $ from 'jquery';

class CommentItem extends Component {
    constructor() {
        super();
        this.state = {
            isShowInput: false,
            content: '',
            replyer: '', // 评论者
            replyerId: '',  // 评论人id
            replayTo: '',   // 被回复者
            replayToHtml: '',
            createTime: ''
        }
    }
    // 回复点击事件，记录被回复人的信息，直接存入数据库，这样做简单
    handleReplyClick({name, user_id}) {
        let replayToHtml = "<a href=\"/#/users/"+ user_id +"\" class=\"item-child-user\" target=\"_blank\" >@"+ name +"</a>";
        this.setState({
            isShowInput: true,
            replayTo: "@" + name + " ",
            replayToHtml: replayToHtml,
            content: "@" + name + " "
        })
    }
    // 取消按钮  坑：为什么点击取消以后再点击回复，此时content的值还是存在的，但是输入框没有动态更新
    handleCancelClick() {
        this.setState({
            isShowInput: false,
        })
    }
    handleReplyInput(e) {
        this.setState({
            content: e.target.value
        })
    }
    render() {
        let { comment, submit } = this.props;
        return (
            <div className="comment-item">
                <div className="item-author">
                    <a href={"/#/users/" + comment.user.user_id } target="_blank">
                        <img src={"//localhost:8000/" + comment.user.head_image } />
                    </a>
                    <div className="item-author-info">
                        <a href={"/#/users/" + comment.user.user_id } target="_blank" className="item-author-name">{comment.user.name}</a>
                        <div className="item-meta">
                            <span>{comment.create_time}</span>
                        </div>
                    </div>
                </div>
                <div className="item-content">
                    <p>{comment.content}</p>
                    <span onClick={this.handleReplyClick.bind(this, comment.user)} className="item-reply">
                        <Icon type="message" />&nbsp;&nbsp;回复</span>
                </div>
                <div className="item-child">
                    {
                        comment.children.map((item, index) => {
                            return (
                                <div key={index} className="item-child-info">
                                    <div>
                                        <a href={"/#/users/" + comment.user.user_id} target="_blank">
                                            <span className="item-child-user">{item.user.name}:</span></a>
                                        <span dangerouslySetInnerHTML={{__html: item.content}}></span>
                                    </div>
                                    <p>
                                        <span onClick={this.handleReplyClick.bind(this, item.user)} className="item-reply">
                                            <Icon type="message" />&nbsp;&nbsp;回复</span>
                                        {item.create_time}
                                    </p>
                                </div>
                            )
                        })
                    }
                    {
                        !!this.state.isShowInput?
                        (<div className="comment-new">
                            <Input type="textarea" rows={4} value={this.state.content}
                                onChange={this.handleReplyInput.bind(this)} placeholder="写下你的评论..."/>
                            <div className="comment-action">
                                <Button onClick={() => {
                                            this.handleCancelClick();
                                            submit(comment.id, this.state.content.replace(this.state.replayTo, this.state.replayToHtml))
                                        }
                                    }>发送</Button>
                                <Button onClick={this.handleCancelClick.bind(this)}>取消</Button>
                            </div>
                        </div>)
                        :""
                    }
                </div>

            </div>
        )
    }
}

class Comment extends Component {
    constructor() {
        super();
        this.state = {
            page: 1,
            pageSize: 10,
            total: 1,
            comments: []
        }
    }

    componentDidMount() {
        $.ajax({
            url: '//127.0.0.1:8000/comment/getComments',
            type: 'get',
            xhrFields:{withCredentials:true},
            dataType: 'json',
            data: {
                know_id: this.props.know_id
            },
            success: res => {
                if(res.status === 0) {
                    // 格式化日期
                    res.data.comments.forEach(item => {
                        item.create_time = util.dateFromat(
                            new Date(item.create_time), 'yyyy-MM-dd hh:mm:ss');
                        item.children.forEach(item2 => {
                            item2.create_time = util.dateFromat(
                                new Date(item2.create_time), 'yyyy-MM-dd hh:mm:ss');
                        })
                    })
                    this.setState({
                        comments: res.data.comments,
                        total: res.data.total
                    })
                } else{
                    message.error(res.message, 2);
                }
            }
        })
    }

    // 处理两个提交，一个是有父评论的，一个是没有的
    handleCommentSubmit(parentId, comment) {
        let knowId = this.props.know_id, userId = this.props.user.user_id,
            input = this.refs.commentInput.refs.input; // 输入框
        if(!comment) {
            comment = input.value; // 获取输入框内容
        }
        if(!comment) {
            message.error('回复内容不能为空...', 2)
            return;
        }
        if(!!parentId.target) {
            parentId = ''
        }
        let data = {
            content: comment,
            know_id: knowId,
            user_id: userId,
            parent_id: parentId,
            create_time: util.dateFromat(new Date(), 'yyyy-MM-dd hh:mm:ss')
        }
        $.ajax({
            url: '//127.0.0.1:8000/comment/save',
            type: 'post',
            xhrFields:{withCredentials:true},
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(data),
            success: res => {
                if(res.status === 0) {
                    if(res.data.parent_id === 1 ) {
                        let comments = this.state.comments;
                        res.data.children = [];
                        comments.unshift(res.data);
                        this.setState({
                            comments: comments
                        })
                        input.value = ''
                    } else {
                        let comments = this.state.comments;
                        comments.forEach(item => {
                            if(item.id === res.data.parent_id) {
                                item.children.unshift(res.data)
                            }
                        })
                        this.setState({
                            comments: comments
                        })
                    }
                    this.setState({
                        total: this.state.total + 1
                    })
                } else{
                    message.error(res.message, 2);
                }
            }
        })
    }

    render() {
        let { user } = this.props;
        return (
            <div className="comment">
                <div className="comment-new">
                    <a className="comment-author" href={"/#/users/" + user.user_id } target="_blank">
                        <img src={"//localhost:8000/" + user.head_image} />
                    </a>
                    <Input type="textarea" rows={4} placeholder="写下你的评论..." ref="commentInput"/>
                    <div className="comment-action">
                        <Button disabled={ !user.user_id } onClick={this.handleCommentSubmit.bind(this)}>
                            {!user.user_id?'登录后评论':'发送'}</Button>
                        <Button>取消</Button>
                    </div>
                </div>
                <div className="comment-list">
                    <p className="comment-total">{this.state.total}条评论...</p>
                    {
                        this.state.comments.map((item, index) => {
                            return <CommentItem key={index} comment={item}
                                submit={this.handleCommentSubmit.bind(this)}/>
                        })
                    }
                </div>
            </div>
        )
    }
}
export default Comment;
