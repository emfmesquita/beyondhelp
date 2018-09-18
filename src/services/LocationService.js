const addBar = (path: String) => {
    if (!path.endsWith("/")) path += "/";
    return path;
};

class LocationService {
    /**
     * Checks if current location is of expecific compendium.
     * @param {*} path 
     */
    static isOnCompendium(path: string): boolean {
        return addBar(window.location.pathname).startsWith(addBar("/compendium/" + path));
    }

    /**
     * Checks if current location if of expecific compendium toc.
     * @param {*} path 
     */
    static isOnToc(path: string): boolean {
        return addBar(window.location.pathname) === addBar("/compendium/" + path);
    }

    /**
     * Parses the current location query as a string->string object.
     */
    static parseQuery() {
        const queryString = window.location.search;
        const query = {};
        const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i].split('=');
            query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
        return query;
    }
}

export default LocationService;