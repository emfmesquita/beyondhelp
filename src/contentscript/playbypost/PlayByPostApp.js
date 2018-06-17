import React, { Component } from 'react';

import PlayByPostData from "../../data/PlayByPostData";
import PlayByPostStorageService from "../../services/storage/PlayByPostStorageService";
import { throttle } from 'lodash';

class PlayByPostApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shownotes: false,
            playByPostData: null
        };
    }

    componentDidMount() {
        PlayByPostStorageService.getCampaignNotes(this.props.owner, this.props.threadid, this.props.safename, this.props.name)
            .then((data) => {
                if (!data) {
                    data = new PlayByPostData();
                }
                if (!data.notes) {
                    data.notes = '';
                }
                return data;
            })
            .then(this.updateState);
    }

    updateState = (playByPostData: PlayByPostData) => {
        this.setState({ playByPostData });
    }

    /**
     * Save the notes from event target into playByPostData
     * @param {Object} event
     */
    saveNotes = (event) => {
        let data = this.state.playByPostData;
        data.notes = event.target.value;
        this.saveData(data);
    }

    /**
     * Saves the current play by post data on storage
     * @param {PlayByPostData} data
     */
    saveData = throttle((data: PlayByPostData) => {
        PlayByPostStorageService.saveCampaignNotes(data, this.props.owner, this.props.threadid, this.props.safename, this.props.name).then(this.updateState);
    }, 1000);

    toggleCampaignNotes = () => {
        this.setState({ shownotes: this.state.shownotes !== true });
    }

    render() {
        return (
            <div className="BH-pbp-area">
                <h6 className="BH-pbp-area-header" onClick={this.toggleCampaignNotes}>
                    {this.state.shownotes === true ? " | Hide" : "+ Show"} Campaign Notes
                </h6>
                {this.state.shownotes &&
                    <textarea
                        defaultValue={this.state.playByPostData === null ? '' : this.state.playByPostData.notes}
                        onChange={this.saveNotes}
                    />
                }
            </div>
        );
    }
}

export default PlayByPostApp;