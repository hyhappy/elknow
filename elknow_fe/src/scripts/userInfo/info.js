import React, {Component} from 'react';
import { } from 'antd';

class Info extends Component {

    render() {
        let userInfo = this.props.userInfo;
        return (
            <div className="user-info">
                <p className="user-info-item user-info-name"><span>用户名：</span>
                    {userInfo.name}</p>
            {
                !!userInfo.head_image?
                <div className="user-info-item user-info-img">
                    <span>用户头像：</span><img title="点击更换头像"
                        src={"//localhost:8000/" + userInfo.head_image}></img>
                </div>:''
            }
            </div>
        )
    }
}

export default Info;
