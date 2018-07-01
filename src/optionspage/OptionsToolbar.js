import React, { Component } from 'react';

class OptionsToolbar extends Component {
    render() {
        return (
            <div className="BH-option-toolbar">
                {this.props.children}
            </div>
        );
    }
}

export default OptionsToolbar;