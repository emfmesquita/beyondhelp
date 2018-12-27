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
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleHeight);
        window.addEventListener('resize', this.handleHeight);
        new ResizeObserver(() => this.updateScrollButtons(this.handleHeight)).observe(this.menuUl);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleHeight);
        window.removeEventListener('resize', this.handleHeight);
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
        if (!this.menuUl) return;
        const hasScroll = this.menuUl.clientHeight < this.menuUl.scrollHeight;
        const hasScrollUp = this.menuUl.scrollTop > 0;
        const hasScrollDown = this.menuUl.scrollTop + this.menuUl.clientHeight < this.menuUl.scrollHeight;

        this.setState({
            hasScroll,
            hasScrollUp,
            hasScrollDown
        }, () => {
            if (callback) callback();
        });
    }

    scroll = (delta) => {
        this.menuUl.scrollTop += delta;
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
            <ul className={"quick-menu quick-menu-tier-1 hidden-scrollbar"} style={{ overflowY: 'auto', overflowX: 'hidden' }} onWheel={this.handleMenuScroll} ref={(el) => this.menuUl = el}>
                {this.props.object.subsections.map(o => <TOCElement key={o.urlName + o.anchorName} object={o} level={2} currentUrl={this.props.currentUrl} menuItemsLookup={this.props.menuItemsLookup} />)}
            </ul>
            {this.renderScrollDown()}
        </React.Fragment>
    );
}

export default TOCApp;