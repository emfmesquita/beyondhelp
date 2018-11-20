import React, { Component } from "react";

import Opt from "../../Options";
import { components } from 'react-select';

class ExtraMapRefsBundleSelectorOption extends Component {
    isDrawing = (bundle: ExtraMapRefsData): boolean => {
        return bundle && bundle.storageId === this.props.selectProps.config[Opt.ExtraMapRefsDrawingBundle];
    }

    isHidden = (bundle: ExtraMapRefsData): boolean => {
        return bundle && bundle.hidden;
    }

    render() {
        let className = "";
        if (this.isDrawing(this.props.data)) className = "BH-bundle-drawing";
        else if (this.isHidden(this.props.data)) className = "BH-bundle-hidden";
        return (
            <components.Option className={className} {...this.props} />
        );
    }
}

export default ExtraMapRefsBundleSelectorOption;