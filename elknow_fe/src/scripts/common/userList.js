import React, {Component} from 'react';
import {Table, Button} from 'antd';

class UserList extends Component {

    render() {
        let {users, isAuthor, action, user} = this.props;
        const columns = [
            {
                title: '名字',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) => <a key={ record.user_id }
                    target="_blank" href={'/users/' + record.user_id}>{text}</a>
            }, {
                title: '头像',
                dataIndex: 'head_image',
                key: 'head_image',
                render: (text, record) => <img key={record.user_id}
                    style={{width: '100px', height: '100px'}} title='头像' alt='头像' src={text}></img>
            }, {
                title: '身份',
                dataIndex: 'admin',
                key: 'admin',
                render: text => text === 1?'管理员':'普通用户' 
            }
        ];
        if(!!isAuthor) {
            let actionColumn = {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                render: (text, record) => (
                    <span className="table-action">
                        {
                            action.map((item,index) => {
                                return (
                                    <Button disabled={record.user_id === user.user_id} key={index} onClick={() => item.action(record)}>
                                        设置为{+record.admin===1?'普通用户':'管理员'}</Button>
                                )
                            })
                        }
                    </span>
                )
            }
            columns.push(actionColumn);
        }
        return (
            <div className="userInfo-knowList">
                <Table bordered rowKey="name" columns={columns} dataSource={users}/>
            </div>
        )
    }
}

export default UserList;
