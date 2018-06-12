import React, { Component } from 'react';

import LinkService from "../services/LinkService";

class Link extends Component {

    render() {
        return <a href="javascript:void(0)" onMouseDown={LinkService.handler(this.props.address)}>{this.props.children}</a>;
    }
}

export default Link;