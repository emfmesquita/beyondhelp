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
        const diceHp = moreInfoDiv.find(".ddb-statblock-item-hit-points .secondary").text();

        // render add buttons on monster more-info block
        const moreInfoBody = $(el).closest(".more-info-body");
        const elementToPrepend = document.createElement("div");

        const toRender = (
            <div className="more-info-footer-details-button">
                <AddMonsterButton monsterdata={{ id, name, hp }} />
                {diceHp && <AddMonsterButton monsterdata={{ id, name, hp: diceHp }} />}
            </div>
        );

        ReactDOM.render(toRender, elementToPrepend);
        moreInfoBody.prepend(elementToPrepend);
    });
});