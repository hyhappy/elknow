import React, {Component} from 'react';
import { Icon, Pagination } from 'antd';

class HotKnow extends Component {

    render() {
        let { knows, total, pageSize, pageChange } = this.props;
        return (
            <div className="elknow-hotKnow">
                <p className="elknow-hotTitle">热门文章</p>
                <ul className="elknow-hotItems">
                {
                    knows.map((item, index) => {
                        return (
                            <li key={index} className="hotKnow-item">
                                <a className="hotKnow-title" target="_blank" href={"/#/knows/"+item.id}>{item.title}</a>
                                <a className="hotKnow-author-name" href={"/#/users/" + item.user_id} target="_blank">{'-- ' + item.name}</a>
                                <ul className="hotKnow-info">
                                    <li>
                                        <Icon type="eye"></Icon>
                                        {item.read_counts}
                                    </li>
                                    <li>
                                        <Icon type="message"></Icon>
                                        {item.comment_counts}
                                    </li>
                                    <li>
                                        <Icon type="star"></Icon>
                                        {item.collect_counts}
                                    </li>
                                </ul>
                            </li>
                        )
                    })
                }
                </ul>
                <Pagination size="small" pageSize={pageSize} total={total}
                    onChange={(page) => {
                        pageChange(page);
                    }}/>
            </div>
        )
    }
}

export default HotKnow;
