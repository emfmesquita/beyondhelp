import { ControlLabel, FormGroup } from 'react-bootstrap';
import React, { Component } from 'react';

import AsyncSelect from 'react-select/async';
import SelectUtils from './SelectUtils';
import { createFilter } from 'react-select';

class SearchField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null
        };

        this.defaultFilterConfig = {
            ignoreCase: true,
            ignoreAccents: true,
            trim: true,
            matchFrom: "any"
        };
    }

    onChange = (value) => {
        this.setState({ value });
        this.props.onChange(value);
    }

    render() {
        return (
            <FormGroup>
                <AsyncSelect
                    classNamePrefix="bh-select"
                    filterOption={this.props.filter ? createFilter(this.defaultFilterConfig) : null}
                    loadOptions={this.props.loadOptions}
                    onChange={this.onChange}
                    placeholder={this.props.placeholder}
                    searchPromptText="No results."
                    value={this.state.value}
                    maxMenuHeight="150px"
                    theme={SelectUtils.defaultTheme()}
                    styles={SelectUtils.defaultStyle()}
                />
            </FormGroup>

        );
    }
}

export default SearchField;