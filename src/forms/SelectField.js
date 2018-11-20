import { ControlLabel, FormGroup } from 'react-bootstrap';
import React, { Component } from 'react';

import Select from 'react-select';
import SelectUtils from './SelectUtils';

class SelectField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null
        };
    }

    onChange = (value) => {
        this.setState({ value });
        this.props.onChange(value);
    }

    render() {
        return (
            <FormGroup>
                <Select
                    classNamePrefix="bh-select"
                    options={this.props.options}
                    onChange={this.onChange}
                    placeholder={this.props.placeholder}
                    searchPromptText="No results."
                    value={this.state.value}
                    maxMenuHeight="150px"
                    theme={SelectUtils.defaultTheme()}
                    styles={SelectUtils.defaultStyle({
                        control: (styles) => ({ ...styles, height: "38px", minHeight: "38px" })
                    })}
                />
            </FormGroup>
        );
    }
}

export default SelectField;