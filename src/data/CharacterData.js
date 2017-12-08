class CharacterData {
    constructor(id: string, name: string, lvl: string, race: string, classes: string, content: HTMLElement) {
        const safe = (val) => (val || "").trim();
        this.id = safe(id);
        this.name = safe(name);
        this.lvl = safe(lvl);
        this.race = safe(race);
        this.classes = safe(classes);
        this.content = content;
    }
}

export default CharacterData;