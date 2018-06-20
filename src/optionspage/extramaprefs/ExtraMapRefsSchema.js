import ExtraMapRefsPatterns from "./ExtraMapRefsPatterns";

const areasSchema = {
    "type": "array",
    "title": "Areas (squares)",
    "items": {
        "type": "object",
        "properties": {
            "coords": {
                "type": "string",
                "title": "Coords",
                "pattern": ExtraMapRefsPatterns.fourCoords
            },
            "headerId": {
                "type": "string",
                "title": "Header Id",
                "pattern": ExtraMapRefsPatterns.htmlId
            },
            "page": {
                "type": "string",
                "title": "Page",
                "pattern": ExtraMapRefsPatterns.page
            },
            "contentId": {
                "type": "string",
                "title": "Content Id",
                "pattern": ExtraMapRefsPatterns.contentId
            }
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
            "coords": {
                "type": "string",
                "title": "Coords",
                "pattern": ExtraMapRefsPatterns.fourCoords
            },
            "contentId": {
                "type": "string",
                "title": "Content Id",
                "pattern": ExtraMapRefsPatterns.contentId
            }
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
            "coords": {
                "type": "string",
                "title": "Coords",
                "pattern": ExtraMapRefsPatterns.threeCoords
            },
            "targetImageName": {
                "type": "string",
                "title": "Target Image",
                "pattern": ExtraMapRefsPatterns.imageName
            }
        },
        "required": ["coords", "targetImageName"]
    }
};

const extraLinksSchema = {
    "type": "array",
    "title": "Extra Header Links",
    "items": {
        "type": "string"
    }
};

const mapsSchema = {
    "type": "array",
    "title": "Maps",
    "items": {
        "type": "object",
        "properties": {
            "page": {
                "type": "string",
                "title": "Page",
                "pattern": ExtraMapRefsPatterns.page
            },
            "mapImageName": {
                "type": "string",
                "title": "Image Name",
                "pattern": ExtraMapRefsPatterns.imageName
            },
            "contentId": {
                "type": "string",
                "title": "Content Id",
                "pattern": ExtraMapRefsPatterns.contentId
            },
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
                "title": "Toc Link Element Id",
                "pattern": ExtraMapRefsPatterns.htmlId
            },
            "tocHeaderSelector": {
                "type": "string",
                "title": "Toc Link CSS Selector"
            },
            "areas": areasSchema,
            "extraAreas": extraAreasSchema,
            "mapToMaps": mapToMapsSchema,
            "extraLinks": extraLinksSchema
        },
        "required": ["page", "mapImageName", "contentId", "menuHeaderId"]
    }
};

const schema = {
    "type": "object",
    "properties": {
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
                    "maps": mapsSchema
                },
                "required": [
                    "path"
                ]
            }
        }
    }
};

export default schema;