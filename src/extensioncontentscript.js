import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";


// chrome.webRequest.onCompleted.addListener((details) => {
//     debugger;
//     $(".more-info-monster").find(".ddb-statblock-monster:first").each((idx, el) => {
//         const id = $(el).closest(".more-info-monster").prev().attr("data-slug");
//         console.log(id);
//     });    
// }, {urls: ["https://www.dndbeyond.com/monsters/*/more-info"]});

chrome.runtime.onMessage.addListener(() => {
    $(".more-info-monster").find(".ddb-statblock-monster:first").each((idx, el) => {
        const id = $(el).closest(".more-info-monster").prev().attr("data-slug");
        console.log(id);
    });
});