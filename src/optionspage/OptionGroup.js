import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';
import OptionButton from "./OptionButton";

class OptionGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: !!props.startExpanded
        };
    }

    toggle = () => {
        this.setState({ expanded: !this.state.expanded });
    }

    renderContent = () => {
        if (!this.state.expanded) return null;
        return this.props.children;
    }

    render() {
        return (
            <div className="BH-option-group">
                <div className="BH-option-group-label" onClick={this.toggle}>
                    {this.props.label}
                    <OptionButton icon={this.state.expanded ? "chevron-down" : "chevron-right"} />
                </div>
                <div className={"BH-option-group-content" + (this.state.expanded ? " expanded" : "")}>
                    {this.renderContent()}
                </div>
            </div>
        );
    }
}

export default OptionGroup;