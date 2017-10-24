import "./OptionLine.css";

import { Glyphicon, ListGroupItem } from 'react-bootstrap';
import React, { Component } from 'react';

class OptionLine extends Component {
    constructor(props) {
        super(props);
        this.icon = this.icon.bind(this);
    }

    icon() {
        return this.props.icon ? <Glyphicon className="Monster-option-icon" glyph={this.props.icon} /> : false;
    }

    render() {
        return <ListGroupItem onClick={this.props.onClick}>{this.props.children}{this.icon()}</ListGroupItem>;
    }
}

export default OptionLine;