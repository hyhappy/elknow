import React, {Component} from 'react';
import wangeditor from 'wangeditor';
import $ from 'jquery';
import { Cascader, Input, Button, message  } from 'antd';
import classify from '../util/classifyData.js';
import emotions from '../util/emotions.js';
import isSign from '../util/sign.js';
import util from '../util/util.js';

import '../../styles/create.css';

let classifys = [];
classify.forEach(item => {
    if(item.value !== 7) {
        classifys.push(item);
    }
})
class Create extends Component {
    constructor() {
        super();
        this.state = {
            //wangHeight: 0,
            editor: '',
            title: '',
            classify: '',
            classifys: '',
            abstract: '',
            content: '',
            user: '',
            isSubmit: false,
            editId: ''
        }
    }
    componentDidMount() {
        // 获取用户信息
        isSign.handleUserInfoGet.bind(this)();

        let query = location.search.split('?')[1];
        if(!!query) {
            query = query.split('=')[1];
        }

        // peizhi wangeditor
        wangeditor.config.printLog = false;
        let editor = new wangeditor('wangeditor');
        editor.config.menus = $.map(editor.config.menus, function(item, key) {
            if (item === 'video') {
                return null;
            }
            return item;
        });
        editor.config.emotions = {
            'default': {
                title: '默认',
                data: emotions
            },
        };

        // 上传图片
        editor.config.uploadImgUrl = "//127.0.0.1:8000/upload/";
        editor.config.uploadHeaders = {
             'Accept' : 'text/x-json'
        }
        editor.config.uploadImgFileName = 'myFileName';
        editor.create();

        this.setState({
            editor: editor
        })

        if(!!query) {
            document.title = "编辑文章";
            this.setState({
                editId: query
            });
            this.handleKnowEdit(query);
        } else {
            document.title = "创建文章";
        }
    }

    handleKnowEdit(query) {
        $.ajax({
            url: '//127.0.0.1:8000/knows/getEditKnowInfo',
            type: 'get',
            xhrFields:{withCredentials:true},
            dataType: 'json',
            data: {
                id: query
            },
            success: res => {
                if(res.status === 0) {
                    this.setState({
                        title: res.data.title,
                        classifys: res.data.classifys,
                        classify: res.data.classify,
                        content: res.data.content,
                        abstract: res.data.abstract
                    });
                    this.state.editor.$txt.html(res.data.content);
                } else {
                    message.error('文章获取失败...', 2, () => {
                        location.href = '/';
                    });
                }
            }
        })
    }

    handleCascaderChange(value) {
        this.setState({
            classify: !!value[1]?value[1]:value[0]
        });
        // 尴尬的实现，或者分类字符串扔到数据库里面，同时也保存分类id
        setTimeout(() => {
            this.setState({
                classifys: $('.ant-cascader-picker-label').eq(0).html()
            })
        }, 10)
    }

    handleSubmitClick() {
        if(!this.handleParamsCheck()) {
            message.error('请先填写完成信息...', 2);
            return;
        }
        this.setState({
            isSubmit: true
        })
        let s = this.state, url;
        // 根据动作判断，是新建还是编辑，编辑页面时，只需要分类，title，content，abstract即可，
        if(s.isEdit === false) {
            url = '//127.0.0.1:8000/knows/save';
        } else {
            url = '//127.0.0.1:8000/knows/save?id=' + this.state.editId;
        }
        let data = {
            user_id: s.user.user_id,
            title: s.title,
            content: s.editor.$txt.html(),
            abstract: s.abstract,
            classify: s.classify,
            classifys: s.classifys,
            create_time: util.dateFromat(new Date(), 'yyyy-MM-dd hh:mm:ss')
        }
        $.ajax({
            url: url,
            type: 'post',
            xhrFields:{withCredentials:true},
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(data),
            success: res => {
                if(res.status === 0) {
                    message.success('创建成功...等待审核中,你可以在个人中心查看状态', 2, () => {
                        location.href = '/';
                    })
                }
            }
        })
    }

    handleParamsCheck() {
        let s = this.state;
        if(s.title === '' || s.comtent === '') {
            return false;
        } else if (s.classify === '') {
            return false;
        } else if (s.abstract === '' || s.abstract.length < 100) {
            return false;
        } else {
            return true;
        }
    }

    render() {
        return (
            <div className="create">
                <div className="create-info">
                    <div className="create-action">
                        <Button type="primary" onClick={()=>history.back()}>取消</Button>
                        <Button type="primary" disabled={this.state.isSubmit || !this.state.user}
                            onClick={this.handleSubmitClick.bind(this)}>发布</Button>
                    </div>
                    <div className="create-info-item">
                        <span>文章标题: </span>
                        <Input value={this.state.title} placeholder="请输入标题..." onChange={ value => {
                                if(this.state.title.length < 20) {
                                    this.setState({
                                        title: value.target.value
                                    })
                                }
                            }}/>
                        <span>{this.state.title.length !== 0?"":"请输入标题，最多20字符"}</span>
                        <span>{this.state.title.length < 20?"":"最多20字符"}</span>
                    </div>
                    <div className="create-info-item">
                        <span>文章分类: </span>
                        <Cascader value={[Math.floor((+this.state.classify)/100), +this.state.classify]}
                            options={classifys} onChange={this.handleCascaderChange.bind(this)}
                            placeholder="请选择分类..."/>
                        <span>{this.state.classify.length !== 0?"":"请选择分类..."}</span>
                    </div>
                    <div className="create-info-item">
                        <span>文章摘要: </span>
                        <Input value={this.state.abstract}
                            type="textarea" rows={3} onChange={value => {
                                this.setState({
                                    abstract: value.target.value
                                })
                            }} placeholder="请输入摘要，至少100字(便于搜索)..."/>
                        <span>{this.state.abstract.length >= 100?"":"还需要输入" +
                            (100 - this.state.abstract.length) + "字..." }</span>
                </div>
                </div>
                <div id="wangeditor" style={{ height: 400 + "px"}}>
                    <p>请输入内容...</p>
                </div>
            </div>
        )
    }
}

export default Create;
