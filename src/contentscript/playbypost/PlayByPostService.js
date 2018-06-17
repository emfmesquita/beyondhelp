import $ from "jquery";
import C from "../../Constants";
import PlayByPostApp from "./PlayByPostApp";
import MessageService from "../../services/MessageService";
import React from 'react';
import ReactDOM from 'react-dom';

/* global chrome */

class PlayByPostService {
    static init() {
        const path = window.location.pathname;

        const pbpThreadPageMatch = path.match(/forums\/d-d-beyond-general\/play-by-post\/(\d+)-(.+)/);
        if (!pbpThreadPageMatch) return;

        const threadid = pbpThreadPageMatch[1];
        const urlsafethreadname = pbpThreadPageMatch[2];

        console.info('In thread ' + threadid + ' for campaign ' + urlsafethreadname);

        MessageService.send(C.UsernameMessage, {}, (username: string) => {
            if (!username) return;
            const fulltitle = $("header.caption-threads h2").text();
            const pbpspan = document.createElement('span');
            $('section#reply > span.help-block').last().before(pbpspan);

            ReactDOM.render(<PlayByPostApp owner={username} threadid={threadid} safename={urlsafethreadname} name={fulltitle} />, pbpspan);

        });
    }
}

export default PlayByPostService;