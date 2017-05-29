import React, {Component} from 'react';
import { Carousel } from 'antd';

class Carous extends Component {

    render() {
        // 这儿使用了轮播，之后可能用到
        return (
            <div className="elknow-carousel">
                <Carousel dots="false">
                    <div className="carousel-item">
                        <img alt="" src="//localhost:8000/images/upup.png"></img>
                    </div>
                </Carousel>
            </div>
        )
    }
}

export default Carous;
