import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';

class OptionButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Glyphicon className={`Bh-option-button ${this.props.className || ""}`} glyph={this.props.icon} title={this.props.title} onClick={this.props.onClick} />
        );
    }
}

export default OptionButton;