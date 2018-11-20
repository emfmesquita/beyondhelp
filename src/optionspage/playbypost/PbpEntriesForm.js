import React, { Component } from 'react';

import ConfirmDialog from '../../modals/ConfirmDialog';
import OptionButton from "../OptionButton";
import PlayByPostStorageService from "../../services/storage/PlayByPostStorageService";
import { debounce } from 'lodash';

class PbpEntriesForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            playByPostData: null,
            showDeleteDialog: false,
            deleteDialogData: null
        };
    }

    componentDidMount() {
        this.initData();
    }

    initData() {
        PlayByPostStorageService.getAllCampaignNotes().then((playByPostData: PlayByPostData[]) => {
            this.setState({ playByPostData: playByPostData });
        });
    }

    handleDeleteClick = (playByPostData: PlayByPostData) => {
        this.setState({
            showDeleteDialog: true,
            deleteDialogData: playByPostData
        });
    }

    deleteData = () => {
        const playByPostData = this.state.deleteDialogData;
        this.setState({ showDeleteDialog: false, deleteDialogData: null }, () => {
            PlayByPostStorageService.deleteCampaignNotes(playByPostData);
            PlayByPostStorageService.getAllCampaignNotes().then((playByPostData: PlayByPostData[]) => {
                this.initData();
            });
        });
    }

    exportData(playByPostData: PlayByPostData) {
        const url = `data:text/plain,Campaign: ${playByPostData.name}\n\nUrl: ${this.threadUrl(playByPostData)}\n\n${playByPostData.notes}`;
        chrome.downloads.download({
            url: url,
            filename: `${playByPostData.urlSafeThreadName}.txt`
        });
    }

    threadUrl(playByPostData: PlayByPostData) {
        return `https://www.dndbeyond.com/forums/d-d-beyond-general/play-by-post/${playByPostData.threadId}-${playByPostData.urlSafeThreadName}`;
    }

    renderRows = (data) => {
        return (
            <div key={data.storageId} className="BH-pbp-form-row">
                <span className="BH-pbp-form-row-info">
                    <a href={this.threadUrl(data)} target="_blank">{data.name}</a>
                </span>
                <OptionButton icon="save" title="Download Notes" onClick={() => this.exportData(data)} />
                <OptionButton icon="trash" title="Delete Notes" onClick={() => this.handleDeleteClick(data)} />
            </div>
        );
    }

    renderEditor = () => {
        if (!this.state.playByPostData) return null;
        return (
            <div className="BH-pbp-form">
                <div className="BH-pbp-form-header">
                    <span className="BH-pbp-form-header BH-pbp-form-row-info">
                        {this.state.playByPostData.length} Campaign{this.state.playByPostData.length !== 1 ? "s" : ""}
                    </span>
                    <OptionButton icon="retweet" title="Refresh Campaign List" onClick={() => this.initData()} />
                </div>
                {this.state.playByPostData.map(this.renderRows)}
            </div>
        );
    }

    render() {
        return (
            <div>
                <ConfirmDialog
                    show={this.state.showDeleteDialog}
                    message="Are you sure to delete these PbP notes?"
                    onCancel={() => this.setState({ showDeleteDialog: false })}
                    confirmButtonStyle="danger"
                    confirmLabel="Delete"
                    onConfirm={this.deleteData}
                />
                {this.renderEditor()}
            </div>
        );
    }
}

export default PbpEntriesForm;
