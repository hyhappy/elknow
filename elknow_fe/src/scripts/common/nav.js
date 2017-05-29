import React, {Component} from 'react';
import { Input, Button } from 'antd';
import isSign from '../util/sign.js';
const Search = Input.Search;

class Nav extends Component {
    constructor() {
        super();
        this.state = {
            query: ''
        }
    }

    handleUserNameClick(user) {
        // 获取用户信息
        isSign.handleUserInfoShow(user);
    }

    render() {
        let { user, queryChange, query } = this.props;

        // 恶心的代码实现
        // 说明一下：结构没有设计好，在其他页面使用导航栏中的搜索时需要跳到主页面显示，但是此处的queryChange
        // query 是主页面传进来的的，其他页面没有，所以此处判断并且重新设置一下值。。。为了区别change和search，还将
        // queryChange中加了一个参数。。。

        if(!queryChange) {
            query = this.state.query;
            queryChange = (value, e) => {
                if(e) {
                    this.setState({
                        query: value
                    })
                } else {
                    location='/?query=' + this.state.query
                }
            }
        }
        return (
            <div className="elknow-nav">
                <span className="nav-title"><a href="/">乐知</a></span>
                <Search placeholder="搜索" size="large" value={query}
                    onChange={ e => queryChange(e.target.value, e) }
                    onSearch={ value => queryChange(value) }/>
                {
                    !!user?
                        <span className="elknow-nav-user" onClick={
                                this.handleUserNameClick.bind(this, user)
                            }>{user}</span>:
                        <Button type="dashed"><a href="/sign_up">登录</a></Button>
                }
                <Button type="primary"><a href="/sign_up?signUp">注册</a></Button>
                <Button type="primary"><a href="/create">写文章</a></Button>
            </div>
        )
    }
}

export default Nav;
