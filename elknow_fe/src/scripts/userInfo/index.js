import React, {Component} from 'react';
import {Layout, Menu, Modal, Icon, message} from 'antd';
import '../../styles/userInfo.css';
import isSign from '../util/sign.js';
import $ from 'jquery';
import Info from './info.js';
import KnowList from '../common/knowTable.js';

import util from '../util/util.js';

const confirm = Modal.confirm;
const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;

class UserInfo extends Component {
    constructor() {
        super();
        this.state = {
            isAdmin: false,
            user: { // 登录用户

            },
            userInfo: { // 查看用户

            },
            selectedKeys: 1,
            knowList: [],
            collectList: []
        }
    }
    componentDidMount() {
        // 只有登录用户才可以看其他人的信息
        isSign.handleUserIsAdmin.bind(this)();
        let params = this.props.match.params;

        if(!!params.id) {
            $.ajax({
                url: '//127.0.0.1:8000/users/getUserInfo',
                type: 'get',
                xhrFields:{withCredentials:true},
                //contentType: 'application/json',
                dataType: 'json',
                data: {
                    id: params.id
                },
                success: res => {
                    if(res.status === 0) {
                        this.setState({
                            userInfo: res.data
                        })
                    } else {
                        message.error(res.message, 2);
                    }
                }
            })
        } else {
            message.error('用户信息不存在...', 2);
        }
    }

    handleMenuSelect({key}) {
        this.setState({
            selectedKeys: +key
        });
        if(+key === 2 && this.state.knowList.length === 0) {
            this.handleKnowListGet();
        } else if(+key === 3 && this.state.collectList.length === 0) {
            this.handleCollectListGet();
        } else {

        }
    }

    handleUpdateImage(image) {
        let userInfo = this.state.userInfo;
        userInfo.head_image = image;
        this.setState({
            userInfo: userInfo
        })
    }

    // 获取该用户的所有收藏,无分页
    handleCollectListGet() {
        $.ajax({
            url: '//127.0.0.1:8000/knows/getUsersCollectList',
            type: 'get',
            xhrFields:{withCredentials:true},
            dataType: 'json',
            data: {
                id: this.state.userInfo.user_id
            },
            success: res => {
                if(res.status === 0) {
                    // 格式化日期
                    res.data.forEach(item => {
                        item.create_time = util.dateFromat(
                            new Date(item.create_time), 'yyyy-MM-dd hh:mm:ss');
                    })
                    this.setState({
                        collectList: res.data
                    })
                } else {

                }
            }
        })
    }

    // 获取该用户的所有文章,无分页
    handleKnowListGet() {
        $.ajax({
            url: '//127.0.0.1:8000/knows/getUsersKnowList',
            type: 'get',
            xhrFields:{withCredentials:true},
            dataType: 'json',
            data: {
                id: this.state.userInfo.user_id
            },
            success: res => {
                if(res.status === 0) {
                    // 格式化日期
                    res.data.forEach(item => {
                        item.create_time = util.dateFromat(
                            new Date(item.create_time), 'yyyy-MM-dd hh:mm:ss');
                    })
                    this.setState({
                        knowList: res.data
                    })
                } else {

                }
            }
        })
    }

    handleKnowDelete(record) {
        this.showConfirm('确定要删除该文章吗?', () => {
            $.ajax({
                url: '//127.0.0.1:8000/knows/delete',
                type: 'get',
                xhrFields:{withCredentials:true},
                dataType: 'json',
                data: {
                    id: record.id
                },
                success: res => {
                    if(res.status === 0) {
                        let knowList = this.state.knowList;
                        let index = knowList.indexOf(record);
                        knowList.splice(index, 1);
                        this.setState({
                            knowList: knowList
                        })
                        message.success('删除成功...', 2);
                    } else {
                        message.error(res.message, 2);
                    }
                }
            })
        })
    }

    handleCollectDelete(record) {
        this.showConfirm('确定要删除该收藏吗?', () => {
            $.ajax({
                url: '//127.0.0.1:8000/collect/delete',
                type: 'get',
                xhrFields:{withCredentials:true},
                dataType: 'json',
                data: {
                    know_id: record.id,
                    user_id: this.state.userInfo.user_id
                },
                success: res => {
                    if(res.status === 0) {
                        let collectList = this.state.collectList;
                        let index = collectList.indexOf(record);
                        collectList.splice(index, 1);
                        this.setState({
                            collectList: collectList
                        })
                        message.success('删除成功...', 2);
                    } else {
                        message.error(res.message, 2);
                    }
                }
            })
        })
    }

    showConfirm(title, ok, cancel) {
        confirm({
            title: title,
            content: '删除后将不可恢复',
            onOk() {
                ok();
            },
            onCancel() {

            },
        });
    }

    render() {
        return (
            <Layout style={{height: '100%'}}>
                <Header className="header">
                    <a href={"/users/" + this.state.userInfo.user_id}>{this.state.userInfo.name+"的个人中心"}</a>
                    {
                        this.state.user.admin === 1? <a href="/management/manage"
                            className="manage">进入管理中心</a> : ''
                    }
                    <a href="/" className="index">首页</a>
                </Header>
                <Layout>
                    <Sider width={200} style={{
                        background: '#fff'
                    }}>
                        <Menu mode="inline" defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']}
                            onClick={this.handleMenuSelect.bind(this)}
                            style={{
                                height: '100%'
                            }}>
                            <SubMenu key="sub1" title={< span > <Icon type="user"/> 个人信息< /span>}>
                                <Menu.Item key="1">我的简介</Menu.Item>
                                <Menu.Item key="2">我的文章</Menu.Item>
                                <Menu.Item key="3">我的收藏</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub2" title={< span > <Icon type="laptop"/>扩展用< /span>}>
                                <Menu.Item key="4">比如...</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Layout style={{
                        padding: '16px'
                    }}>
                        <Content style={{
                            background: '#fff',
                            padding: 24,
                            margin: 0,
                            minHeight: 280
                        }}>
                            {
                                this.state.selectedKeys === 1?<Info userInfo={this.state.userInfo}
                                    isAuthor={this.state.userInfo.user_id === this.state.user.user_id}
                                    changeImage={this.handleUpdateImage.bind(this)}
                                />:''
                            }
                            {
                                this.state.selectedKeys === 2?
                                <KnowList action={
                                        [{
                                            type: '编辑',
                                            action: (record) => {
                                                    location.href = '/create?id=' + record.id;
                                                }
                                        }, {
                                            type: '删除',
                                            action: this.handleKnowDelete.bind(this)
                                        }]
                                    }
                                    isAuthor={this.state.userInfo.user_id === this.state.user.user_id}
                                    knows={this.state.knowList}
                                    />:''
                            }
                            {
                                this.state.selectedKeys === 3?
                                <KnowList action={
                                        [{
                                            type: '删除',
                                            action: this.handleCollectDelete.bind(this)
                                        }]
                                    }
                                    isAuthor={this.state.userInfo.user_id === this.state.user.user_id}
                                    knows={this.state.collectList}
                                    />:''
                            }
                            {
                                this.state.selectedKeys === 4?
                                <span>啥都没有...</span>:''
                            }
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}

export default UserInfo;
