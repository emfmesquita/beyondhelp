import React, { Component } from 'react';
import $ from 'jquery';
import { throttle } from 'lodash';
import TOCElement from './TOCElement';

export const handleHeight = throttle(evt => {
    const menu = $('.quick-menu-tier-1');
    const top = menu[0].getBoundingClientRect().top;
    let contentHeight = 0;
    menu.children().map((idx, e) => contentHeight += $(e).outerHeight());
    const availableSpace = $(window).height() - top - 20;
    const newHeight = Math.min(contentHeight, availableSpace);
    menu.height(newHeight);
    menu.css('max-height', newHeight + 2);
}, 100);

class TOCApp extends Component {

    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        window.addEventListener('resize', this.handleResize);
        handleHeight();
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
    }

    handleScroll(event) {
        handleHeight(event);
    }

    handleResize(event) {
        handleHeight(event);
    }

    render = () => (
        <React.Fragment>
            <div className="sidebar-menu-top">
                <a href="#top" className="sidebar-menu-top-link">Back to Top</a>
            </div>
            <ul className={"quick-menu quick-menu-tier-1 hidden-scrollbar"} style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                {this.props.object.subsections.map(o => <TOCElement key={o.urlName + o.anchorName} object={o} level={2} currentUrl={this.props.currentUrl} />)}
            </ul>
        </React.Fragment>
    );
}

export default TOCApp;