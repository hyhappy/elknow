import React, {Component} from 'react';
import {Table, Button} from 'antd';

class KnowList extends Component {

    render() {
        let {knows, isAuthor, action} = this.props;
        const columns = [
            {
                title: '标题',
                dataIndex: 'title',
                key: 'title',
                render: (text, record) => <a key={ record.id }
                    target="_blank" href={'/knows/' + record.id}>{text}</a>
            }, {
                title: '摘要',
                dataIndex: 'abstract',
                key: 'abstract'
            }, {
                title: '分类',
                dataIndex: 'classifys',
                key: 'classifys'
            }, {
                title: '阅读次数',
                dataIndex: 'read_counts',
                key: 'read_counts'
            }, {
                title: '收藏次数',
                dataIndex: 'collect_counts',
                key: 'collect_counts'
            }, {
                title: '评论次数',
                dataIndex: 'comment_counts',
                key: 'comment_counts'
            }, {
                title: '创建时间',
                dataIndex: 'create_time',
                key: 'create_time'
            }, {
                title: '状态',
                dataIndex: 'isOnline',
                key: 'isOnline',
                render: (text) => text === 1?'上线中':'下线中' 
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
                                    <Button key={index} disabled={(record.isOnline === 0 && item.type === '下线') || 
                                    (record.isOnline === 1 && item.type === '上线')}
                                        onClick={() => item.action(record, item.type === '上线')}>{item.type}</Button>
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
                <Table bordered rowKey="id" columns={columns} dataSource={knows}/>
            </div>
        )
    }
}

export default KnowList;
