import React, { Component } from 'react';

import $ from "jquery";
import PageScriptService from '../../services/PageScriptService';
import UidService from '../../services/UidService';

/**
 * List of characters on my characters page, can be inside or outside folders.
 */
class CharacterList extends Component {
    constructor(props) {
        super(props);
    }

    // workaround for modal clicks that works after chrome 71
    // this is really ugly - if global scope of onclick comes back to work
    // change back to it on CharacterService.js
    modalClickWorkaround = (e: MouseEvent) => {
        if (e.target.tagName !== "A") return;

        const jqElement = $(e.target);
        if (!jqElement.hasClass("modal-link")) return;

        const uid = UidService.id();
        jqElement.attr("bh-id", uid);

        PageScriptService.run(`
            const link = $("[bh-id=${uid}]")[0];
            console.log(link);

            const dummyE = { preventDefault: () => {} };

            Cobalt.Forms.handleModalLinks.apply(link, [dummyE]);
        `);
        e.preventDefault();
        e.stopPropagation();
    }

    renderCharacters = () => {
        return this.props.characters.map(character => {
            const charHtml = character.content.children[0].outerHTML;
            // not dangerous all is done on client side, the html string does not come from server
            return <li onClick={this.modalClickWorkaround} className="ddb-campaigns-character-card-wrapper" key={character.id} dangerouslySetInnerHTML={{ __html: charHtml }} />;
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