import React, { Component } from 'react';

class MonsterCRIndicator extends Component {
    render() {
        return (
            <div className="BH-Monster-cr-indicator">
                <div className="BH-Monster-cr">{this.props.cr}</div>
                <div className="BH-Monster-cr-border" />
                <div className="BH-Monster-cr-label">CR</div>
            </div>
        );
    }
}

export default MonsterCRIndicator;