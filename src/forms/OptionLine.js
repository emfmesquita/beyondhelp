import "./OptionLine.css";

import { Glyphicon, ListGroupItem } from 'react-bootstrap';
import React, { Component } from 'react';

class OptionLine extends Component {
    icon = () => {
        return this.props.icon ? <Glyphicon className="Monster-option-icon" glyph={this.props.icon} /> : false;
    }

    render() {
        return (
            <ListGroupItem className={this.props.disabled && "Monster-option-disabled"} onClick={this.props.disabled ? null : this.props.onClick}>
                {this.props.children}{this.icon()}
            </ListGroupItem>
        );
    }
}

export default OptionLine;