class CharacterFolderData {
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.expanded = false;
        this.characterIds = [];
    }
}

export default CharacterFolderData;