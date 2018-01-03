import React, { Component } from 'react';
import Select from 'react-select';
import { ControlLabel, FormGroup } from 'react-bootstrap';

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
                    autoload={false}
                    onBlurResetsInput={false}
                    onCloseResetsInput={false}
                    options={this.props.options}
                    onChange={this.onChange}
                    placeholder={this.props.placeholder}
                    searchPromptText="No results."
                    value={this.state.value}
                />
            </FormGroup>
        );
    }
}

export default SelectField;