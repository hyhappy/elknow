import React, {Component} from 'react';
import { Menu, Dropdown, Badge } from 'antd';
import classify from '../util/classifyData.js';

let menu = [];

class Classify extends Component {

    handleRenderMenu() {
        menu = classify.map(item => {
            return item.children.map(item => {
                return <Menu.Item key={item.value}>{item.label}</Menu.Item>
            })
        })
    }
    handleButtonClick(key, change) {
        return () => change(key);
    }

    render() {
        this.handleRenderMenu();
        let { change } = this.props;
        return (
            <div className="elknow-classify">
                {
                    classify.map((item, index) => {
                        return <Dropdown.Button key={item.value} onClick={this.handleButtonClick(item.value, change)}
                            overlay={<Menu onClick={ ({key}) => change(key)}>{menu[index]}</Menu>}>
                                <span className="classify-name">{item.label}</span>
                                
                            </Dropdown.Button>
                    })
                }
            </div>

        )
    }
}

export default Classify;
