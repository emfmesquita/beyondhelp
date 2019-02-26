class CharacterData {
    constructor(id: string, name: string, lvl: string, race: string, classes: string, content: HTMLElement) {
        const safe = (val: string) => (val || "").trim();
        this.id = safe(id);
        this.name = safe(name);
        this.lvl = safe(lvl);
        this.race = safe(race);
        this.classes = safe(classes);
        this.naturalSort = 0;
        this.content = content;
    }
}

export default CharacterData;