// gets the nth position of a character on a string
const getPosition = (string: string, subString: string, index: number) => {
    return string.split(subString, index).join(subString).length;
};

const getPageInfo = (pathname: string) => {
    const fullPath = pathname.substr(12);
    const pathEnd = getPosition(fullPath, "/", 2);
    const builtInfo = {
        path: fullPath.substr(0, pathEnd + 1),
        page: fullPath.substr(pathEnd + 1)
    };
    builtInfo.isOnToc = builtInfo.page === "";
    return builtInfo;
};

const info = getPageInfo(window.location.pathname);

const pageInfoCache = {};

class ExtraMapRefsPathService {
    static currentPageInfo() {
        return info;
    }

    static pageInfo(url: string) {
        const cached = pageInfoCache[url];
        if (cached) return cached;

        const builtInfo = getPageInfo(new URL(url).pathname);
        pageInfoCache[url] = builtInfo;
        return builtInfo;
    }
}

export default ExtraMapRefsPathService;