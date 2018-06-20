import ExtraMapRefsPatterns from "./ExtraMapRefsPatterns";


const attToErrorTitle = {
    compendiums: "Compendiums",
    path: "Path",
    maps: "Map",
    areas: "Area",
    extraAreas: "Extra Info Area",
    mapToMaps: "Map to Map Area",
    page: "Page",
    mapImageName: "Image Name",
    contentId: "Content Id",
    menuHeaderId: "Menu Element Id",
    isChapterMap: "Chapter Map on TOC",
    tocHeaderId: "Toc Link Element Id",
    tocHeaderSelector: "Toc Link CSS Selector",
    coords: "Coords",
    headerId: "Header Id",
    targetImageName: "Target Image"
};

const patternToMsg = {
    [ExtraMapRefsPatterns.path]: `Invalid path format. E.G. "something/otherthing/"`,
    [ExtraMapRefsPatterns.page]: `Invalid page format. E.G. "somethingwithoutbar" or "something/otherthingnotendinginbar"`,
    [ExtraMapRefsPatterns.imageName]: `Invalid image name format. E.G. "somename.myextention" or "other-name.jpg"`,
    [ExtraMapRefsPatterns.contentId]: `Invalid content id format. E.G. "something-like-this-but-with-random-numbers-instead-of-words"`,
    [ExtraMapRefsPatterns.htmlId]: `Invalid html id format. E.G. "SomethingLikeThis" or "1just-not-start-with-crazy-characters"`,
    [ExtraMapRefsPatterns.fourCoords]: `Invalid coords format. Sould be four numbers separated by comma. E.G. "1,2,3,4"`,
    [ExtraMapRefsPatterns.threeCoords]: `Invalid coords format. Sould be three numbers separated by comma. E.G. "1,2,3"`
};

function transformErrors(errors) {
    return errors.map(error => {
        if (error.name === "required") {
            error.message = `${attToErrorTitle[error.params.missingProperty]} is a required property`;
        }
        if (error.name === "type" && error.property.indexOf("extraLinks") >= 0) {
            error.message = "Empty CSS selector.";
        }
        if (error.name === "pattern") {
            const msg = patternToMsg[error.params.pattern];
            error.message = msg || "Invalid format.";
        }
        return error;
    });
}

export default transformErrors;