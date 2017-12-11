import React, { Component } from 'react';

/**
 * List of characters on my characters page, can be inside or outside folders.
 */
class CharacterList extends Component {
    constructor(props) {
        super(props);
    }

    renderCharacters = () => {
        return this.props.characters.map(character => {
            const charHtml = character.content.children[0].outerHTML;
            // not dangerous all is done on client side, the html string does not come from server
            return <li className="ddb-campaigns-character-card-wrapper" key={character.id} dangerouslySetInnerHTML={{ __html: charHtml }} />;
        });
    }

    render() {
        return (
            <ul className="listing listing-rpgcharacter rpgcharacter-listing BH-character-list">
                {this.renderCharacters()}
            </ul>
        );
    }
}

export default CharacterList;