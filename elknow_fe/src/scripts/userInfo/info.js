import React, {Component} from 'react';
import { Button } from 'antd';
import $ from 'jquery';

class Info extends Component {

    handleSignOut() {
        $.ajax({
            url: '//127.0.0.1:8000/sign/signOut',
            xhrFields:{withCredentials:true},
            type: 'get',
            dataType: 'json',
            success: res => {
                if(res.status === 0) {
                    document.location = '/';
                }
            }
        })   
    }

    handleUploadImage() {
        var formData = new FormData();
        formData.append('file', $('#file')[0].files[0]);
        $.ajax({
            url: '//localhost:8000/upload/',
            type: 'post',
            cache: false,
            data: formData,
            xhrFields:{withCredentials:true},
            processData: false,
            contentType: false,
            success: res => {
                $.ajax({
                    url: '//localhost:8000/users/updateImage',
                    type: 'get',
                    data: {
                        id: this.props.userInfo.user_id,
                        head_image: res
                    },
                    success: res2 => {
                        if(res2.status === 0) {
                            this.props.changeImage(res)
                        }
                    }
                })
            }
        })
    }

    render() {
        let { userInfo, isAuthor } = this.props;
        return (
            <div className="user-info">
                <p className="user-info-item user-info-name"><span>用户名：</span>
                    {userInfo.name}</p>
            {
                !!isAuthor?
                <div className="user-info-item user-info-img">
                    <span>用户头像：</span><img alt="头像找不到了" onClick={() => this.refs.file.click()} title="点击更换头像"
                        src={userInfo.head_image}></img>
                        <input id="file" ref="file" type="file" onChange={this.handleUploadImage.bind(this)} 
                            style={{display:'none'}}/>
                </div>:
                <div className="user-info-item user-info-img">
                    <span>用户头像：</span><img alt="头像找不到了" src={userInfo.head_image}></img>
                </div>
            }
            <Button type="primary" onClick={this.handleSignOut}>退出系统</Button>
            </div>
        )
    }
}

export default Info;
