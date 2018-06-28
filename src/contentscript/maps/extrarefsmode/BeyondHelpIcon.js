import "./BeyondHelpIcon.scss";
import React, { Component } from 'react';

const defaultSize = "16px";

class BeyondHelpIcon extends Component {

    style = () => {
        const size = this.props.size || defaultSize;
        return {
            width: size,
            height: size,
            lineHeight: size
        };
    }

    render() {
        return <span className="BH-icon" style={this.style()} />;
    }
}

export default BeyondHelpIcon;