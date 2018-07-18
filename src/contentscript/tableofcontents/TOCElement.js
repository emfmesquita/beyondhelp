import React, { Component } from 'react';

const chapterUrl = (object, currentUrl) =>
    currentUrl === object.urlName ? object.anchorName : `https://www.dndbeyond.com/compendium/${object.urlName}${object.anchorName}`;

class TOCElement extends Component {

    render = () => (
        <li className="quick-menu-item quick-menu-item-closed">
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
                    {this.props.object.subsections.map(o => <TOCElement key={o.urlName + o.anchorName} object={o} level={this.props.level + 1} currentUrl={this.props.currentUrl} />)}
                </ul>
            }
        </li>
    );
}

export default TOCElement;