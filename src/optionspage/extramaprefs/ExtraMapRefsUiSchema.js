
const page = {
    "ui:placeholder": "Url path after compendium path. E.g. a1/the-sunless-citadel."
};

const areaPage = {
    "ui:placeholder": "Same as map page, only needed if points to another page content."
};

const contentId = {
    "ui:placeholder": "Html 'data-content-chunk-id' attribute of target sub content."
};

const untilContentId = {
    "ui:placeholder": `Should only be filled if multiples sub contents are desired.`
};

const targetImageName = {
    "ui:placeholder": "Filename of target map image."
};

const coords = {
    "ui:placeholder": "Coordinates of top left and bottom right points. E.g 100,40,110,50"
};

const areaColor = {
    "ui:widget": "colorPicker"
};

const areasUi = {
    "ui:arrayItemTitle": "Area",
    "ui:arrayTabProp": "coords",
    "ui:arrayAddable": false,
    "items": {
        "coords": coords,
        "headerId": {
            "ui:placeholder": "Html id attribute of the target header."
        },
        "page": areaPage,
        "contentId": contentId,
        "untilContentId": untilContentId,
        "color": areaColor
    }
};

const extraAreasUi = {
    "ui:arrayItemTitle": "Extra Info Area",
    "ui:arrayTabProp": "coords",
    "ui:arrayAddable": false,
    "items": {
        "coords": coords,
        "contentId": contentId,
        "untilContentId": untilContentId,
        "page": areaPage,
        "color": areaColor
    }
};

const mapToMapsUi = {
    "ui:arrayItemTitle": "Map to Map Area",
    "ui:arrayTabProp": "targetImageName",
    "ui:arrayTabSorted": true,
    "ui:arrayAddable": false,
    "items": {
        "coords": {
            "ui:placeholder": "Coordinates center point plus the circle radius. E.g 100,40,10"
        },
        "targetImageName": targetImageName,
        "color": areaColor
    }
};

const commentsUi = {
    "ui:arrayItemTitle": "Comment Area",
    "ui:arrayTabProp": "coords",
    "ui:arrayAddable": false,
    "items": {
        "coords": coords,
        "comment": {
            "ui:widget": "textarea"
        },
        "color": areaColor
    }
};

const extraMenuLinksUi = {
    "items": {
        "ui:placeholder": "Html id attribute of extra menu elements related to map."
    }
};

const mapsUi = {
    "ui:arrayTabProp": "mapImageName",
    "ui:arrayTabSorted": true,
    "ui:arrayAddable": false,
    "items": {
        "page": page,
        "mapImageName": {
            "ui:placeholder": "Filename of map image."
        },
        "contentId": {
            "ui:placeholder": "Content id attribute of the element that contains the map."
        },
        "menuHeaderId": {
            "ui:placeholder": "Html id attribute of menu element related to map."
        },
        "tocHeaderId": {
            "ui:placeholder": "Not required. Menu Element Id used if empty."
        },
        "tocHeaderSelector": {
            "ui:placeholder": "Not required. Overrides 'Toc Link Element Id'."
        },
        "color": {
            "ui:widget": "colorPicker"
        },
        "simpleAreas": areasUi,
        "extraAreas": extraAreasUi,
        "mapToMaps": mapToMapsUi,
        "comments": commentsUi,
        "extraMenuHeaderIds": extraMenuLinksUi
    }
};

const extraLinksUi = {
    "ui:arrayItemTitle": "Link to Map",
    "ui:arrayTabProp": "selector",
    "items": {
        "page": page,
        "targetImageName": targetImageName,
        "selector": {
            "ui:placeholder": "CSS selector of header element to add a link to the map."
        }
    }
};

const uischema = {
    "compendiums": {
        "ui:arrayTabProp": "path",
        "ui:arrayTabSorted": true,
        "ui:arrayAddable": false,
        "ui:options": {
            orderable: false
        },
        "items": {
            "path": {
                "ui:placeholder": "Url path after /compendium. E.g. adventures/toa/"
            },
            "color": {
                "ui:widget": "colorPicker"
            },
            "maps": mapsUi,
            "extraLinks": extraLinksUi
        }
    },
    "color": {
        "ui:widget": "colorPicker"
    }
};

export default uischema;