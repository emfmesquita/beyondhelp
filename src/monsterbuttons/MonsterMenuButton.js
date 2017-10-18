import React, { Component } from 'react';
import './MonsterMenuButton.css';

class MonsterMenuButton extends Component {
    render() {
        const className = "Monster-menu-button" + (this.props.hidden ? " hidden" : "");
        return (
            <a href="javascript:void(0)" className={className} onMouseDown={this.props.onClick} title={this.props.title} role="button">
                <span className={`glyphicon ${this.props.icon}`} aria-hidden="true" />
            </a>
        );
    }
}

export default MonsterMenuButton;