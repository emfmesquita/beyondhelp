import './SampleHpBar.css';

import React, { Component } from 'react';

import ColorService from "./services/ColorService";

class SampleHpBar extends Component {

    render() {
        return (
            <div className="progress Monster-sample-bar" style={{ marginBotton: "0px" }}>
                <div className="progress-bar progress-bar-danger" role="progressbar" style={{ width: "50%", backgroundImage: ColorService.progressBarBackground(this.props.color) }}>
                    <div className="Monster-hp-bar-text" style={{ color: ColorService.progressBarTextColor(this.props.textColor) }}>{this.props.label}</div>
                </div>
            </div>
        );
    }
}

export default SampleHpBar;