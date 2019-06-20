import React, { Component } from 'react';
import $ from 'jquery';
import { throttle } from 'lodash';
import TOCElement from './TOCElement';

let scrollInterval = 0;

class TOCApp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hasScroll: false,
            hasScrollUp: false,
            hasScrollDown: false,
            scrollInterval: 0
        };
        this.menuUl = React.createRef();
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleHeight);
        window.addEventListener('resize', this.handleHeight);
        this.menuUl.current.addEventListener('wheel', this.handleMenuScroll);
        new ResizeObserver(() => this.updateScrollButtons(this.handleHeight)).observe(this.menuUl.current);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleHeight);
        window.removeEventListener('resize', this.handleHeight);
        this.menuUl.current.removeEventListener('wheel', this.handleMenuScroll);
    }

    handleHeight = throttle(() => {
        const usedSpace = this.state.hasScroll ? 46 : 20;
        const menu = $('.quick-menu-tier-1');
        const top = menu[0].getBoundingClientRect().top;
        const availableSpace = $(window).height() - top - usedSpace;
        menu.css('max-height', availableSpace);
    }, 100);

    handleMenuScroll = (e) => {
        this.scroll(e.deltaY);
        e.preventDefault();
    }

    updateScrollButtons = (callback) => {
        const menu = this.menuUl.current;
        if (!menu) return;
        const hasScroll = menu.clientHeight < menu.scrollHeight;
        const hasScrollUp = menu.scrollTop > 0;
        const hasScrollDown = menu.scrollTop + menu.clientHeight < menu.scrollHeight;

        this.setState({
            hasScroll,
            hasScrollUp,
            hasScrollDown
        }, () => {
            if (callback) callback();
        });
    }

    scroll = (delta) => {
        this.menuUl.current.scrollTop += delta;
        this.updateScrollButtons();
    }

    startScrollInterval = (delta) => {
        this.scroll(delta);
        scrollInterval = setInterval(() => {
            requestAnimationFrame(() => this.scroll(delta));
        }, 100);
    }

    stopScrollInterval = () => {
        clearInterval(scrollInterval);
    }

    renderScrollUp = () => {
        if (!this.state.hasScroll) return null;
        const className = `BH-toc-scroll-button BH-toc-scroll-up ${this.state.hasScrollUp ? "" : "BH-disabled"}`;
        return (
            <div className={className} onMouseDown={() => this.startScrollInterval(-30)} onMouseUp={this.stopScrollInterval} onMouseOut={this.stopScrollInterval}>
                <i className={"fa fa-chevron-up-solid"} />
            </div>
        );
    }

    renderScrollDown = () => {
        if (!this.state.hasScroll) return null;
        const className = `BH-toc-scroll-button BH-toc-scroll-down ${this.state.hasScrollDown ? "" : "BH-disabled"}`;
        return (
            <div className={className} onMouseDown={() => this.startScrollInterval(30)} onMouseUp={this.stopScrollInterval} onMouseOut={this.stopScrollInterval}>
                <i className={"fa fa-chevron-down-solid"} />
            </div>
        );
    }

    render = () => (
        <React.Fragment>
            <div className="sidebar-menu-top">
                <a href="#top" className="sidebar-menu-top-link">Back to Top</a>
            </div>
            {this.renderScrollUp()}
            <ul className={"quick-menu quick-menu-tier-1 hidden-scrollbar"} style={{ overflowY: 'auto', overflowX: 'hidden' }} ref={this.menuUl}>
                {this.props.object.subsections.map(o => <TOCElement key={o.urlName + o.anchorName} object={o} level={2} currentUrl={this.props.currentUrl} menuItemsLookup={this.props.menuItemsLookup} />)}
            </ul>
            {this.renderScrollDown()}
        </React.Fragment>
    );
}

export default TOCApp;