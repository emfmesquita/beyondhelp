import React, { Component } from 'react';
import { Async } from 'react-select';
import { ControlLabel, FormGroup } from 'react-bootstrap';

class SearchField extends Component {
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
                <Async
                    autoload={false}
                    onBlurResetsInput={false}
                    filterOptions={false}
                    loadOptions={this.props.loadOptions}
                    onChange={this.onChange}
                    placeholder={this.props.placeholder}
                    searchPromptText="No results."
                    value={this.state.value}
                />
            </FormGroup>

        );
    }
}

export default SearchField;