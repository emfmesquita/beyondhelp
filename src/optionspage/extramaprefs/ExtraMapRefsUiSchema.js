
const areasUi = {
    "ui:arrayItemTitle": "Area",
    "ui:arrayTabProp": "coords",
    "items": {
        "coords": {
            "ui:placeholder": "Coordinates of top left and bottom right points. E.g 100,40,110,50"
        },
        "headerId": {
            "ui:placeholder": "Html id attribute of the target header."
        },
        "page": {
            "ui:placeholder": "Same as map page, only needed if points to another page content."
        },
        "contentId": {
            "ui:placeholder": "Html 'data-content-chunk-id' attribute of target sub content."
        }
    }
};

const extraAreasUi = {
    "ui:arrayItemTitle": "Extra Info Areas",
    "ui:arrayTabProp": "coords",
    "items": {
        "coords": {
            "ui:placeholder": "Coordinates of top left and bottom right points. E.g 100,40,110,50"
        },
        "contentId": {
            "ui:placeholder": "Html 'data-content-chunk-id' attribute of target sub content."
        }
    }
};

const mapToMapsUi = {
    "ui:arrayItemTitle": "Map to Map Area",
    "ui:arrayTabProp": "targetImageName",
    "items": {
        "coords": {
            "ui:placeholder": "Coordinates center point plus the circle radius. E.g 100,40,10"
        },
        "targetImageName": {
            "ui:placeholder": "Html id attribute of the target header."
        }
    }
};


const extraLinksUi = {
    "items": {
        "ui:placeholder": "CSS selector of header element to add a link to the map."
    }
};

const mapsUi = {
    "ui:arrayTabProp": "mapImageName",
    "items": {
        "page": {
            "ui:placeholder": "Url path after compendium path. E.g. a1/the-sunless-citadel."
        },
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
        "areas": areasUi,
        "extraAreas": extraAreasUi,
        "mapToMaps": mapToMapsUi,
        "extraLinks": extraLinksUi
    }
};

const uischema = {
    "compendiums": {
        "ui:arrayTabProp": "path",
        "ui:options": {
            orderable: false
        },
        "items": {
            "path": {
                "ui:placeholder": "Url path after /compendium. E.g. adventures/toa/"
            },
            "maps": mapsUi
        }
    }
};

export default uischema;