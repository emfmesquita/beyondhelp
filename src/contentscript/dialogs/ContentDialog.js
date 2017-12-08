import React, { Component } from 'react';

/**
 * Dialog on content page.
 */
class ContentDialog extends Component {
    render() {
        return (
            <div id={this.props.dialogId} className="ddb-modal" title="Delete Folder" style={{ display: "none" }}>
                <div className="ddb-modal-form">
                    <div className="ddb-modal-header">
                        <div className="ddb-modal-header-text">
                            {this.props.message}
                        </div>
                    </div>
                    <a className="ajax-post button" href="javascript:void(0)" onClick={this.props.onConfirm}>
                        {this.props.confirmText || "Yes"}
                    </a>
                </div>
            </div>
        );
    }
}

export default ContentDialog;