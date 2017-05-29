import React, {Component} from 'react';
// import {} from 'antd';
// import $ from 'jquery';
import cookie from 'cookie';
import { BackTop} from 'antd';
import '../../styles/elknow.css';
import Nav from '../common/nav.js';
import Carous from './carousel.js';
import Classify from './classify.js';
import KnowList from './knowList.js';
import HotKnow from './hotKnow.js';
import isSign from '../util/sign.js';
import util from '../util/util.js';
import $ from 'jquery';

class Elknow extends Component {
    constructor() {
        super();
        this.state = {
            user: '',
            knowList: [],
            hotKnowList: [],
            query: '',
            pageSize: 10,
            hotPageSize: 8,
            hotPage: 1,
            classify: '',
            total: 1 ,// 设置成1是为了让分页组件默认显示在第一个,
            hotTotal: 1
        }
    }

    componentDidMount() {
        // 获取当前用户信息
        isSign.handleUserInfoGetNoSign.bind(this)();

        // 从其他页面跳转过来并且带着query参数时执行
        if (!!location.hash.split('?')[1]) {
            let queryString = location.hash.split('?')[1];
            let query = queryString.split('=')[1];
            this.handleQueryChange(query);
        }

        // 默认获取第一页
        this.handleKnowListGet(1);
        this.handleHotKnowListGet(1);
    }

    handleKnowListGet(page) {
        $.ajax({
            url: '//47.93.254.33/knows/getKnowList',
            type: 'get',
            xhrFields:{withCredentials:true},
            dataType: 'json',
            data: {
                page: page,
                pageSize: this.state.pageSize,
                query: this.state.query,
                classify: this.state.classify
            },
            success: res => {
                if(res.status === 0) {
                    // 格式化日期
                    res.data.knows.forEach(item => {
                        item.create_time = util.dateFromat(
                            new Date(item.create_time), 'yyyy-MM-dd hh:mm:ss');
                    })
                    this.setState({
                        knowList: res.data.knows,
                        total: res.data.total
                    })
                } else {

                }
            },
            error: function(err) {
                console.log(err);
            }
        })
    }

    handleHotKnowListGet(page) {
        $.ajax({
            url: '//47.93.254.33/knows/getHotKnowList',
            type: 'get',
            xhrFields:{withCredentials:true},
            dataType: 'json',
            data: {
                page: page,
                pageSize: this.state.hotPageSize
            },
            success: res => {
                if(res.status === 0) {
                    this.setState({
                        hotKnowList: res.data.knows,
                        hotTotal: res.data.total
                    })
                } else {

                }
            }
        })
    }

    handlePageChange(page) {
        this.handleKnowListGet(page);
    }

    handleHotPageChange(page) {
        this.handleHotKnowListGet(page);
    }

    handleClassifyChange(classify) {
        // 7代表着全部，此时清空选项规则和查询条件
        if(classify === 7) {
            this.setState({
                classify: '',
                query: ''
            }, () => {
                this.handleKnowListGet(1);
            })
        } else {
            this.setState({
                classify: classify
            }, () => {
                this.handleKnowListGet(1);
            })
        }
    }

    handleQueryChange(query) {
        this.setState({
            query: query
        }, () => {
            this.handleKnowListGet(1)
        })
    }

    render() {
        return (
            <div className="elknow">
                <Nav user={this.state.user.name} query={this.state.query}
                    queryChange={this.handleQueryChange.bind(this)}/>
                <div className="elknow-content">
                    <Carous />
                    <div className="elknow-content-lf">
                        <Classify change={this.handleClassifyChange.bind(this)}/>
                        <KnowList knows={this.state.knowList} pageSize={this.state.pageSize}
                            total={this.state.total} pageChange={this.handlePageChange.bind(this)}/>
                    </div>
                    <div className="elknow-content-rg">
                        <HotKnow knows={this.state.hotKnowList}
                            total={this.state.hotTotal} pageSize={this.state.hotPageSize}
                            pageChange={this.handleHotPageChange.bind(this)}/>
                    </div>
                </div>
                <BackTop />
            </div>
        )
    }
}

export default Elknow;
