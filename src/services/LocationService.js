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
}

export default LocationService;