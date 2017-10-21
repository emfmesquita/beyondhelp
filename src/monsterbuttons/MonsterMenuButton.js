import './MonsterMenuButton.scss';

import React, { Component } from 'react';

class MonsterMenuButton extends Component {
    render() {
        const fromParent = this.props.className || "";
        const hidden = this.props.hidden ? " hidden" : "";
        const className =  `${fromParent} Monster-menu-button ${hidden}`;
        return (
            <a href="javascript:void(0)" className={className} onMouseDown={this.props.onClick} title={this.props.title} role="button">
                <span className={`glyphicon ${this.props.icon}`} aria-hidden="true" />
            </a>
        );
    }
}

export default MonsterMenuButton;