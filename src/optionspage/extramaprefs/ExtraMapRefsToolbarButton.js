import { Button, Glyphicon } from "react-bootstrap";
import React, { Component } from "react";

class ExtraMapRefsToolbarButton extends Component {
    render() {
        return (
            <Button bsSize="small" style={{ marginLeft: "4px", marginRight: "4px" }} className="navbar-btn" disabled={this.props.disabled} active={this.props.active} title={this.props.title} onClick={this.props.onClick}>
                <Glyphicon style={{ marginRight: "4px" }} glyph={this.props.icon} />
                {this.props.label}
            </Button>
        );
    }
}

export default ExtraMapRefsToolbarButton;