import { Button, Modal } from 'react-bootstrap';
import React, { Component } from 'react';

class DeleteEncounterAlert extends Component{
    render(){
        return (
            <Modal show={this.props.show} onHide={this.props.onHide}>
                <Modal.Body>
                    Are you sure you want to delete this encounter and all monsters in it?
                </Modal.Body>
                <Modal.Footer>
                    <Button bsSize="small" bsStyle="danger" onClick={this.props.onDelete}>Delete</Button>
                    <Button bsSize="small" onClick={this.props.onHide}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default DeleteEncounterAlert;