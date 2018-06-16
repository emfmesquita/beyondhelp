import "./OptionsApp.scss";

import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';
import { debounce } from 'lodash';
import PlayByPostStorageService from "../services/storage/PlayByPostStorageService";

class PbpEntriesForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            playByPostData: null
        };
    }

    componentDidMount() {
        this.initData();
    }

    initData() {
        PlayByPostStorageService.getAllCampaignNotes().then((playByPostData: PlayByPostData[]) => {
            this.setState({playByPostData: playByPostData});
        });
    }

    deleteData(playByPostData: PlayByPostData) {
        PlayByPostStorageService.deleteCampaignNotes(playByPostData);
        PlayByPostStorageService.getAllCampaignNotes().then((playByPostData: PlayByPostData[]) => {
            this.initData();
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

    renderEditor = () => {
        if (!this.state.playByPostData) return null;
        return (
            <div style={{border: '1px black solid', padding: '2px', height: '80px', overflow:"scroll"}}>
                <table width="100%">
                    <tr>
                        <th colspan="2">{this.state.playByPostData.length} campaign{this.state.playByPostData.length !== 1 ? "s" : ""}</th>
                        <th><Glyphicon glyph="refresh" onClick={() => this.initData()}/></th>
                    </tr>
                    {this.state.playByPostData.map((data, idx) => (
                        <tr>
                            <td width="80%"><a href={this.threadUrl(data)}>{data.name}</a></td>
                            <td width="10%"><Glyphicon glyph="download" onClick={() => { this.exportData(data)}}/></td>
                            <td width="10%"><Glyphicon glyph="remove" onClick={() => { this.deleteData(data)}}/></td>
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