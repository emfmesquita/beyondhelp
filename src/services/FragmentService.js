class FragmentData {
    constructor(id: string, contentId: string, contentOnly: boolean = false) {
        this.id = id;
        this.contentId = contentId;
        this.contentOnly = contentOnly;
    }
}

class FragmentService {
    static format(id: string, contentId: string, contentOnly = false) {
        return contentId ? `#cid:${contentOnly ? "co:" : ""}${id}:${contentId}` : `#${id}`;
    }

    static parse(hash: string): FragmentData {
        if (!hash) return null;
        const fragment = hash.substring(1);
        if (!hash.startsWith("#cid:")) return new FragmentData(fragment);
        const tokens = fragment.split(":");
        if (tokens[1] === "co") return new FragmentData(tokens[2], tokens[3], true);
        return new FragmentData(tokens[1], tokens[2]);
    }
}

export {
    FragmentData,
    FragmentService
};