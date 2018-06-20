import './MenuButton.scss';

import React, { Component } from 'react';

class MenuButton extends Component {
    render() {
        const fromParent = this.props.className || "";
        const hidden = this.props.hidden ? " hidden" : "";
        const className = `${fromParent} Menu-button ${hidden}`;
        return (
            <a href="javascript:void(0)" className={className} onMouseDown={this.props.onClick} title={this.props.title} role="button">
                <span className={`glyphicon ${this.props.icon}`} aria-hidden="true" />
            </a>
        );
    }
}

export default MenuButton;