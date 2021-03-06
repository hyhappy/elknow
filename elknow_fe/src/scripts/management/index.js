import React, {Component} from 'react';
import {Layout, Menu, Modal, Icon, message} from 'antd';
import isSign from '../util/sign.js';
import $ from 'jquery';
import KnowList from '../common/knowTable.js';
import UserList from '../common/userList.js';
import util from '../util/util.js';
import KnowCreate from './knowCreate.js';

const confirm = Modal.confirm;
const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;

class Management extends Component {
    constructor() {
        super();
        this.state = {
            user: { // 登录用户
                admin: 0
            },
            selectedKeys: 1,
            knowList: [],
            collectList: [],
            userList: []
        }
    }
    componentDidMount() {
        // 只有登录并且是管理员才可以进入这个页面，传入回调函数进行处理
        isSign.handleUserIsAdmin.bind(this)(() => {
            if(this.state.user.admin !== 1) {
                message.error('你不是管理员，即将跳到首页...', 2, () => {
                    location.href = '/';
                });
            }
            this.handleUserListGet();
        });
        
    }

    handleMenuSelect({key}) {
        this.setState({
            selectedKeys: +key
        });
        if(+key === 1 && this.state.userList.length === 0) {
            this.handleUserListGet();
        } else if(+key === 2 && this.state.knowList.length === 0) {
            this.handleKnowListGet();
        } else {

        }
    }

    handleUserListGet() {
        $.ajax({
            url: '//127.0.0.1:8000/users/getUserLists',
            type: 'get',
            xhrFields:{withCredentials:true},
            dataType: 'json',
            success: res => {
                if(res.status === 0) {
                    this.setState({
                        userList: res.data
                    })
                } else {

                }
            }
        })
    }

    handleAuthorityChange(record) {
        this.showConfirm('确定要将其设置为'+(record.admin===1?'普通用户吗':'管理员吗'), '', () => {
            $.ajax({
                url: '//127.0.0.1:8000/users/authorityChange',
                type: 'get',
                xhrFields:{withCredentials:true},
                dataType: 'json',
                data: {
                    id: record.user_id,
                    admin: record.admin
                },
                success: res => {
                    if(res.status === 0) {
                        let userList = this.state.userList;
                        let index = userList.indexOf(record);
                        userList[index].admin = res.data;
                        this.setState({
                            userList: userList
                        })
                        message.success('修改成功...', 2);
                    } else {
                        message.error(res.message, 2);
                    }
                }
            })
        })
    }

    // 获取所有文章,无分页
    handleKnowListGet() {
        $.ajax({
            url: '//127.0.0.1:8000/knows/getKnowLists',
            type: 'get',
            xhrFields:{withCredentials:true},
            dataType: 'json',
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
        this.showConfirm('确定要删除该文章吗?', '删除之后将不可恢复', () => {
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

    handleKnowOnline(record, type) {
        this.showConfirm('确定要上线该知识吗?', '', () => {
            $.ajax({
                url: '//127.0.0.1:8000/knows/online',
                type: 'get',
                xhrFields:{withCredentials:true},
                dataType: 'json',
                data: {
                    id: record.id,
                    type: type
                },
                success: res => {
                    if(res.status === 0) {
                        let knowList = this.state.knowList;
                        let index = knowList.indexOf(record);
                        knowList[index].isOnline = (type === true?1:0);
                        this.setState({
                            knowList: knowList
                        })
                        message.success('更新成功...', 2);
                    } else {
                        message.error(res.message, 2);
                    }
                }
            })
        })
    }

    showConfirm(title, content, ok, cancel) {
        confirm({
            title: title,
            content: content,
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
                    <a href="/" className="manage">首页</a>
                    <a href="/management/manage" className="manage">管理中心</a>
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
                            <SubMenu key="sub1" title={< span >  <Icon type="laptop"/>管理中心< /span>}>
                                <Menu.Item key="1"><Icon type="user"/>所有用户</Menu.Item>
                                <Menu.Item key="2"><Icon type="file"/>所有文章</Menu.Item>
                                <SubMenu key="sub3" title={< span > <Icon type="laptop"/> 知识管理< /span>}>
                                    <Menu.Item key="3"><Icon type="book"/>所有知识</Menu.Item>
                                    <Menu.Item key="4"><Icon type="file-add"/>知识创建</Menu.Item>
                                </SubMenu>
                            </SubMenu>
                            <SubMenu key="sub2" title={< span > <Icon type="laptop"/>扩展用< /span>}>
                                <Menu.Item key="5">比如...</Menu.Item>
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
                                this.state.selectedKeys === 1?<UserList action={
                                    [{
                                        type: '',
                                        action: this.handleAuthorityChange.bind(this)
                                    }]
                                }
                                isAuthor={true}
                                users={this.state.userList}
                                user={this.state.user}/>:''
                            }
                            {
                                this.state.selectedKeys === 2?
                                <KnowList action={
                                        [{
                                            type: '删除',
                                            action: this.handleKnowDelete.bind(this)
                                        }, {
                                            type: '上线',
                                            action: this.handleKnowOnline.bind(this)
                                        }, {
                                            type: '下线',
                                            action: this.handleKnowOnline.bind(this)
                                        }]
                                    }
                                    isAuthor={true}
                                    knows={this.state.knowList}
                                    />:''
                            }
                            {
                                this.state.selectedKeys === 3?
                                <span>啥都没有...</span>:''
                            }
                            {
                                this.state.selectedKeys === 4?
                                <KnowCreate />:''
                            }
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}

export default Management;
