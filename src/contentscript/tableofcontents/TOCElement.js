import React, { Component } from 'react';

import UidService from "../../services/UidService";

const chapterUrl = (object, currentUrl) =>
    currentUrl === object.urlName ? object.anchorName : `https://www.dndbeyond.com/compendium/${object.urlName}${object.anchorName}`;

class TOCElement extends Component {

    constructor(props) {
        super(props);
        this.bhId = UidService.id();
    }

    addMenuItemLookup = () => {
        const menuEntry = this.props.object;
        const menuItemsLookup = this.props.menuItemsLookup;

        if (!menuEntry.anchorName) return;
        const id = menuEntry.anchorName.substr(1);
        if (id) menuItemsLookup[id] = this.bhId;
    }

    render = () => {
        if (window.location.pathname.endsWith(this.props.object.urlName)) this.addMenuItemLookup();
        return (
            <li className="quick-menu-item quick-menu-item-closed" bh-id={this.bhId}>
                <div className="quick-menu-item-label">
                    <a className="quick-menu-item-link" href={chapterUrl(this.props.object, this.props.currentUrl)}>
                        {this.props.object.title}
                    </a>
                    {this.props.object.subsections.length > 0 &&
                        <div className="quick-menu-item-trigger" />
                    }
                </div>
                {this.props.object.subsections.length > 0 &&
                    <ul className={"quick-menu quick-menu-tier-" + this.props.level}>
                        {this.props.object.subsections.map(o => <TOCElement key={o.urlName + o.anchorName} object={o} level={this.props.level + 1} currentUrl={this.props.currentUrl} menuItemsLookup={this.props.menuItemsLookup} />)}
                    </ul>
                }
            </li>
        );
    };
}

export default TOCElement;