import React, {Component} from 'react';
import {Form, Icon, Input, Button, Checkbox} from 'antd';
import $ from 'jquery';
import cookie from 'cookie';
import '../../styles/sign_up.css';
const FormItem = Form.Item;

class Login extends Component {
    constructor() {
        super();
        this.state = {
            isSignIn: true,
            isSignSucc: true,
            signTip: ''
        }
    }

    handleTitleClick(type) {
        if((type === 'in' && this.state.isSignIn === true) ||
            (type === 'up' && this.state.isSignIn === false)) {
            return;
        }
        this.setState({
            isSignIn: !this.state.isSignIn,
            signTip: ''
        })
    }

    componentDidMount() {
        // 判断是不是 注册，从导航栏过来的时候会带参数signUp
        if(location.hash.split('?')[1] === 'signUp') {
            this.setState({
                isSignIn: false
            })
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!!err) {
               this.setState({
                   signTip: ''
               })
               return;
            }
            if(this.state.isSignIn === true) {
                $.ajax({
                    url: '//127.0.0.1:8000/sign/signin',
                    type: 'post',
                    xhrFields:{withCredentials:true},
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify(values),
                    success: res => {
                        if(res.status === 0) {
                            document.cookie = cookie.serialize('user', res.data)
                            location.href = '/';
                        } else {
                            // 设置登录状态，显示密码错误提示
                            this.setState({
                                isSignSucc: false,
                                signTip: res.message
                            })
                            // 将输入域清空
                            this.props.form.setFieldsValue({
                                passWordIn: ''
                            })
                        }
                    }
                })
            } else {
                // 做前台验证
                if(values.passWordUp !== values.passWordAgain) {
                    this.setState({
                        isSignSucc: false,
                        signTip: '两次密码不一致...'
                    })
                    return;
                }
                $.ajax({
                    url: '//127.0.0.1:8000/sign/signup',
                    type: 'post',
                    xhrFields:{withCredentials:true}, //
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify(values),
                    success: res => {
                        if(res.status === 0) {
                            // 根据返回data值来判断是否直接用注册用户登录
                            if(!!res.data) {
                                document.cookie = cookie.serialize('user', res.data)
                                // location.href = '/';
                            } else {
                                this.setState({
                                    isSignSucc: false,
                                    signTip: res.message
                                })
                            }
                        } else {
                            // 设置登录状态，显示密码错误提示
                            this.setState({
                                isSignSucc: false,
                                signTip: res.message
                            })
                            // 将输入域清空
                            this.props.form.setFieldsValue({
                                passWordUp: '',
                                passWordAgain: ''
                            })
                        }
                    }
                })
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div className="container">
                <div className="sign">
                    <div className="sign-title">
                        <span onClick={this.handleTitleClick.bind(this)}
                            className={!!this.state.isSignIn?'sign-active':''}>登录</span>
                        ·
                        <span onClick={this.handleTitleClick.bind(this)}
                            className={!this.state.isSignIn?'sign-active':''}>注册</span>
                    </div>
                    {
                    this.state.isSignIn?
                    <Form onSubmit={this.handleSubmit.bind(this)} className="sign-in">
                        <FormItem>
                            {getFieldDecorator('userNameIn', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入用户名!'
                                    }
                                ]
                            })(
                                <Input prefix={< Icon type="user" style={{ fontSize: 13 }}/>} placeholder="用户名"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('passWordIn', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入密码!'
                                    }
                                ]
                            })(
                                <Input prefix={< Icon type="lock" style={{ fontSize: 13 }}/>} type="password" placeholder="密码"/>
                            )}
                            {this.state.isSignSucc?'':
                                <p className="sign-in-tip">{this.state.signTip}</p>
                            }
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true
                            })(
                                <Checkbox>记住我</Checkbox>
                            )}
                            <a className="login-form-forgot" href="">忘记密码</a>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </FormItem>
                    </Form>
                    :
                    <Form onSubmit={this.handleSubmit.bind(this)} className="sign-up">
                        <FormItem>
                            {getFieldDecorator('userNameUp', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入用户名!'
                                    }
                                ]
                            })(
                                <Input prefix={< Icon type="user" style={{ fontSize: 13 }}/>} placeholder="用户名"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('passWordUp', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入密码!'
                                    }
                                ]
                            })(
                                <Input prefix={< Icon type="lock" style={{ fontSize: 13 }}/>} type="password" placeholder="密码"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('passWordAgain', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请再次输入密码!'
                                    }
                                ]
                            })(
                                <Input prefix={< Icon type="lock" style={{ fontSize: 13 }}/>} type="password" placeholder="核对密码"/>
                            )}
                            {this.state.isSignSucc?'':
                                <p className="sign-in-tip">{this.state.signTip}</p>
                            }
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                注册
                            </Button>
                        </FormItem>
                    </Form>
                    }
                </div>
            </div>
        );
    }
}

const SignUp = Form.create()(Login);

export default SignUp;
