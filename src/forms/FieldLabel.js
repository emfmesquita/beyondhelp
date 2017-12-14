import React, { Component } from "react";

import { ControlLabel } from 'react-bootstrap';

class FieldLabel extends Component {
    render() {
        return <ControlLabel>{this.props.label}</ControlLabel>;
    }
}
export default FieldLabel;