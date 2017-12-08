import React, { Component } from 'react';

/**
 * Modal on content page.
 */
class ContentModal extends Component {
    constructor(props) {
        super(props);
        this.renderBody = this.renderBody.bind(this);
    }

    componentDidMount() {
        if (this.props.onUpdate) this.props.onUpdate();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.onUpdate) this.props.onUpdate();
    }

    renderBody() {
        if (!this.props.opened) return null;
        return (
            <div className="fullscreen-modal-overlay">
                <div className="fullscreen-modal race-confirm-modal" tabIndex="-1">
                    <div className="fullscreen-modal-header">
                        <div className="fullscreen-modal-heading">{this.props.title}</div>
                        <div className="fullscreen-modal-close" onClick={this.props.onCancel}>
                            <span className="fullscreen-modal-close-btn" />
                        </div>
                    </div>
                    <div className="fullscreen-modal-content">
                        {this.props.content}
                    </div>
                    <div className="fullscreen-modal-footer">
                        <div className="fullscreen-modal-accept fullscreen-modal-action">
                            <button className="character-button character-button-modal" onClick={this.props.onConfirm}>
                                {this.props.confirmText || "Confirm"}
                            </button>
                        </div>
                        <div className="fullscreen-modal-cancel fullscreen-modal-action">
                            <button className="character-button character-button-modal-cancel" onClick={this.props.onCancel}>
                                {this.props.cancelText || "Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="ReactModalPortal">
                {this.renderBody()}
            </div>
        );
    }
}

export default ContentModal;