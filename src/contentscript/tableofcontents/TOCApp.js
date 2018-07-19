import React, { Component } from 'react';
import TOCElement from './TOCElement';

class TOCApp extends Component {

    render = () => (
        <React.Fragment>
            <div className="sidebar-menu-top">
                <a href="#top" className="sidebar-menu-top-link">Back to Top</a>
            </div>
            <ul className={"quick-menu quick-menu-tier-" + 1}>
                {this.props.object.subsections.map(o => <TOCElement key={o.urlName + o.anchorName} object={o} level={2} currentUrl={this.props.currentUrl} />)}
            </ul>
        </React.Fragment>
    );
}

export default TOCApp;