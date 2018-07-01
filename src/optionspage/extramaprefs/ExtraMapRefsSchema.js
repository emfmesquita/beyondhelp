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
            "untilContentId": untilContentId
        },
        "required": ["coords"]
    }
};

const extraAreasSchema = {
    "type": "array",
    "title": "Extra Info Areas (rhombus)",
    "items": {
        "type": "object",
        "properties": {
            "coords": coords(ExtraMapRefsPatterns.fourCoords),
            "contentId": contentId("From Content Id"),
            "untilContentId": untilContentId,
            "page": page
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
            "targetImageName": targetImageName
        },
        "required": ["coords", "targetImageName"]
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
            "areas": areasSchema,
            "extraAreas": extraAreasSchema,
            "mapToMaps": mapToMapsSchema,
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