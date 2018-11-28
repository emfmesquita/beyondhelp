import ExtraMapRefsPatterns from "./ExtraMapRefsPatterns";

const page = {
    "type": "string",
    "title": "Page",
    "pattern": ExtraMapRefsPatterns.page
};

const contentId = (title: string) => {
    return {
        "type": "string",
        "title": title,
        "pattern": ExtraMapRefsPatterns.contentId
    };
};

const untilContentId = {
    "type": "string",
    "title": "Until Content Id (not including)",
    "pattern": ExtraMapRefsPatterns.contentId
};

const targetImageName = {
    "type": "string",
    "title": "Target Map Image",
    "pattern": ExtraMapRefsPatterns.imageName
};

const areaColor = {
    "title": "Area Color",
    "type": "string",
    "default": ""
};

const coords = (pattern) => {
    return {
        "type": "string",
        "title": "Coords",
        "pattern": pattern
    };
};

const areasSchema = {
    "type": "array",
    "title": "Areas (squares)",
    "items": {
        "type": "object",
        "properties": {
            "coords": coords(ExtraMapRefsPatterns.fourCoords),
            "headerId": {
                "type": "string",
                "title": "Header Id",
                "pattern": ExtraMapRefsPatterns.htmlId
            },
            "page": page,
            "contentId": contentId("From Content Id"),
            "untilContentId": untilContentId,
            "color": areaColor
        },
        "required": ["coords"]
    }
};

const extraAreasSchema = {
    "type": "array",
    "title": "Extra Info Areas (diamonds)",
    "items": {
        "type": "object",
        "properties": {
            "coords": coords(ExtraMapRefsPatterns.fourCoords),
            "contentId": contentId("From Content Id"),
            "untilContentId": untilContentId,
            "page": page,
            "color": areaColor
        },
        "required": ["coords", "contentId"]
    }
};

const mapToMapsSchema = {
    "type": "array",
    "title": "Map to Map Areas (circles)",
    "items": {
        "type": "object",
        "properties": {
            "coords": coords(ExtraMapRefsPatterns.threeCoords),
            "targetImageName": targetImageName,
            "color": areaColor
        },
        "required": ["coords", "targetImageName"]
    }
};

const commentsSchema = {
    "type": "array",
    "title": "Comment Areas",
    "items": {
        "type": "object",
        "properties": {
            "coords": coords(ExtraMapRefsPatterns.fourCoords),
            "comment": {
                "type": "string",
                "title": "Comment"
            },
            "title": {
                "type": "string",
                "title": "Title (Optional)"
            },
            "color": areaColor
        },
        "required": ["coords", "comment"]
    }
};

const extraMenuLinksSchema = {
    "type": "array",
    "title": "Extra Menu Element Ids",
    "items": {
        "pattern": ExtraMapRefsPatterns.htmlId,
        "type": "string"
    }
};

const mapsSchema = {
    "type": "array",
    "title": "Maps",
    "items": {
        "type": "object",
        "properties": {
            "page": page,
            "mapImageName": {
                "type": "string",
                "title": "Image Name",
                "pattern": ExtraMapRefsPatterns.imageName
            },
            "contentId": contentId("Content Id"),
            "menuHeaderId": {
                "type": "string",
                "title": "Menu Element Id",
                "pattern": ExtraMapRefsPatterns.htmlId
            },
            "isChapterMap": {
                "type": "boolean",
                "title": "Is the Chapter Map on TOC?"
            },
            "tocHeaderId": {
                "type": "string",
                "title": "Toc Link Id",
                "pattern": ExtraMapRefsPatterns.htmlId
            },
            "tocHeaderSelector": {
                "type": "string",
                "title": "Toc Link CSS Selector"
            },
            "color": {
                "title": "Map Global Color",
                "type": "string",
                "default": ""
            },
            "simpleAreas": areasSchema,
            "extraAreas": extraAreasSchema,
            "mapToMaps": mapToMapsSchema,
            "comments": commentsSchema,
            "extraMenuHeaderIds": extraMenuLinksSchema
        },
        "required": ["page", "mapImageName", "contentId", "menuHeaderId"]
    }
};

const extraLinksSchema = {
    "type": "array",
    "title": "Extra Links to Maps",
    "items": {
        "type": "object",
        "properties": {
            "page": page,
            "selector": {
                "type": "string",
                "title": "Header CSS Selector"
            },
            "targetImageName": targetImageName
        },
        "required": ["page", "selector", "targetImageName"]
    }
};

const schema = {
    "type": "object",
    "properties": {
        "name": {
            "title": "Bundle Name",
            "type": "string",
            "maxLength": 40
        },
        "color": {
            "title": "Bundle Global Color",
            "type": "string",
            "default": ""
        },
        "compendiums": {
            "title": "Compendiums",
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "title": "Path",
                        "pattern": ExtraMapRefsPatterns.path
                    },
                    "color": {
                        "title": "Compendium Global Color",
                        "type": "string",
                        "default": ""
                    },
                    "maps": mapsSchema,
                    "extraLinks": extraLinksSchema
                },
                "required": [
                    "path"
                ]
            }
        }
    },
    "required": [
        "name"
    ]
};

export default schema;