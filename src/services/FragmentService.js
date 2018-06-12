class FragmentData {
    constructor(id: string, contentId: string, untilContentId: string, contentOnly: boolean = false) {
        this.id = id;
        this.contentId = contentId || "";
        this.untilContentId = untilContentId || "";
        this.contentOnly = contentOnly;
    }
}

class FragmentService {
    static format(id: string, contentId: string, untilContentId: string, contentOnly = false) {
        if (!contentId) return `#${id}`;
        if (contentOnly) return `#cid:co:${id}:${contentId}`;
        let fragment = `#cid:${id}:${contentId}`;
        if (untilContentId) fragment += `:${untilContentId}`;
        return fragment;
    }

    static parse(hash: string): FragmentData {
        if (!hash) return null;
        const fragment = hash.substring(1);
        if (!hash.startsWith("#cid:")) return new FragmentData(fragment);
        const tokens = fragment.split(":");
        if (tokens[1] === "co") return new FragmentData(tokens[2], tokens[3], true);
        return new FragmentData(tokens[1], tokens[2], tokens[3]);
    }
}

export {
    FragmentData,
    FragmentService
};