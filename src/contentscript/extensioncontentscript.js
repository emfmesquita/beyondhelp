import React from 'react';
import ReactDOM from 'react-dom';
import AddMonsterButton from './AddMonsterButton';
import $ from "jquery";

chrome.runtime.onMessage.addListener(() => {
    $(".more-info-monster:not(.bh-processed").find(".ddb-statblock-monster:first").each((idx, el) => {
        // gather monster info from page
        const moreInfoDiv = $(el).closest(".more-info-monster");
        moreInfoDiv.addClass("bh-processed");
        const rowDiv = moreInfoDiv.prev();

        const id = rowDiv.attr("data-slug");
        const name = rowDiv.find(".monster-name a").text();
        const hp = moreInfoDiv.find(".ddb-statblock-item-hit-points .primary").text();

        // render add buttons on monster more-info block
        const moreInfoBody = $(el).closest(".more-info-body");
        const elementToPrepend = document.createElement("div");

        ReactDOM.render(<AddMonsterButton monsterdata={{id, name, hp}}/>, elementToPrepend);
        moreInfoBody.prepend(elementToPrepend);
    });
});