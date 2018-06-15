import "./OptionsApp.scss";

import React, { Component } from 'react';

import { debounce } from 'lodash';
import PlayByPostStorageService from "../services/storage/PlayByPostStorageService";

class PbpEntriesForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            playByPostData: null
        };

        PlayByPostStorageService.getAllCampaignNotes().then((playByPostData: PlayByPostData[]) => {
            this.setState({playByPostData: playByPostData});
        });
    }

    deleteData(playByPostData: PlayByPostData) {
        PlayByPostStorageService.deleteCampaignNotes(playByPostData);
        PlayByPostStorageService.getAllCampaignNotes().then((playByPostData: PlayByPostData[]) => {
            this.setState({playByPostData: playByPostData});
        });
    }

    exportData(playByPostData: PlayByPostData) {
        const url = `data:text/plain,Url: ${this.threadUrl(playByPostData)}\n\n${playByPostData.notes}`;
        chrome.downloads.download({
            url: url,
            filename: `${playByPostData.urlSafeThreadName}.txt`
        });
    }

    threadUrl(playByPostData: PlayByPostData) {
        return `https://www.dndbeyond.com/forums/d-d-beyond-general/play-by-post/${playByPostData.threadId}-${playByPostData.urlSafeThreadName}`;
    }

    renderEditor = () => {
        if (!this.state.playByPostData) return null;
        return (
            <div>
                <table>
                    {this.state.playByPostData.map((data, idx) => (
                        <tr>
                            <td><a href={this.threadUrl(data)}>{data.name}</a></td>
                            <td><a onClick={() => { this.exportData(data)} }>Export</a></td>
                            <td><a onClick={() => { this.deleteData(data)} }>Delete</a></td>
                        </tr>
                    ))}
                </table>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderEditor()}
            </div>
        );
    }
}

export default PbpEntriesForm;