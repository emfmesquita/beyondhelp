class HomebrewEntry {
    constructor(name: string, path: string, author: string) {
        this.name = name;
        this.path = path;
        this.author = author;
        this.version = null;
    }
}

export default HomebrewEntry;