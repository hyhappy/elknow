import React, {Component} from 'react';
import { Icon, Pagination } from 'antd';

class KnowItem extends Component {

    render() {
        let info = this.props.info;
        return (
            <div className="elknow-knowItem">
                <div className="knowItem-author">
                    <a className="author-headImage" target="_blank" href={"/users/" + info.user_id}>
                        <img alt="" src={"//127.0.0.1:8000/" + info.head_image} />
                    </a>
                    <div className="author-info">
                        <a className="author-name" href={"/users/" + info.user_id} target="_blank">
                            {info.name}</a>
                        <span className="author-create-time">{info.create_time}</span>
                    </div>
                </div>
                <a className="knowItem-title" target="_blank" href={"/knows/"+info.id}>{info.title}</a>
                <p className="knowItem-abstract">
                    {info.abstract}
                </p>
                <ul className="knowItem-info">
                    <li>
                        {info.classifys}
                    </li>
                    <li>
                        <Icon type="eye"></Icon>
                        {!!info.read_counts?info.read_counts:0}
                    </li>
                    <li>
                        <Icon type="message"></Icon>
                        {!!info.comment_counts?info.comment_counts:0}
                    </li>
                    <li>
                        <Icon type="star"></Icon>
                        {!!info.collect_counts?info.collect_counts:0}
                    </li>
                </ul>
            </div>
        )
    }
}

class KnowList extends Component {
    render() {
        let { knows, total, pageSize, pageChange} = this.props;
        return (
            <div className="elknow-knowList">
                {
                    knows.map((item, index) => {
                        return <KnowItem key={index} info={item}/>
                    })
                }

                {
                    total === 0?
                    <div className="elknow-noKnows">sorry,没有查询到信息...</div>:
                    <Pagination size="small" pageSize={pageSize} total={total}
                        onChange={(page) => {
                            pageChange(page);
                        }}/>
                }
            </div>
        )
    }
}

export default KnowList;
