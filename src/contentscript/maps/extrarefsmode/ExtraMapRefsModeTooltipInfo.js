class ExtraMapRefsModeTooltipInfo {
    constructor(target: JQuery<HTMLElement>) {
        this.target = target;
        this.middle = null;
        this.right = null;
        this.copy = null;
    }

    rightInfo(label: string, text: string): ExtraMapRefsModeTooltipInfo {
        this.right = label ? { label, text } : {};
        return this;
    }

    middleInfo(label: string, text: string): ExtraMapRefsModeTooltipInfo {
        this.middle = label ? { label, text } : {};
        return this;
    }
}

export default ExtraMapRefsModeTooltipInfo;