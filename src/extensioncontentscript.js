// import React from 'react';
// import ReactDOM from 'react-dom';
import $ from "jquery";

const bhAddMonster = function(id, name, hp){
    console.log(id);
    console.log(name);
    console.log(hp);
}

chrome.runtime.onMessage.addListener(() => {
    $(".more-info-monster:not(.bh-processed").find(".ddb-statblock-monster:first").each((idx, el) => {
        const moreInfoDiv = $(el).closest(".more-info-monster");
        moreInfoDiv.addClass("bh-processed");
        const rowDiv = moreInfoDiv.prev();
        const id = rowDiv.attr("data-slug");
        const name = rowDiv.find(".monster-name a").text();
        const hp = moreInfoDiv.find(".ddb-statblock-item-hit-points .primary").text();

        const moreInfoBody = $(el).closest(".more-info-body");

        const buttonHtml = '<div class="more-info-footer-details-button"><a class="button button-monsters" href="javascript:void(0);">Add</a></div>';
        moreInfoBody.prepend(buttonHtml).on("click", () => bhAddMonster(id, name, hp));
    });
});