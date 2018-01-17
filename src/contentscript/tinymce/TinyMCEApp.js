import 'react-select/dist/react-select.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './TinyMCEApp.scss';

import { MenuItem, Nav, NavDropdown, NavItem } from 'react-bootstrap';
import React, { Component } from 'react';

import C from "../../Constants";
import MessageService from "../../services/MessageService";
import Opt from "../../Options";
import TinyMCETablesTab from "./TinyMCETablesTab";
import TinyMCETooltipsTab from "./TinyMCETooltipsTab";

const tooltipsTabId = "tooltips";
const tablesTabId = "tables";

class TinyMCEApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: props.tableHtml || !props.config[Opt.TooltipsTab] ? tablesTabId : tooltipsTabId
        };
    }

    add = (content: string) => {
        content = content.trim();
        window.top.postMessage({ action: C.AddContentToTinyMessage, content }, "*");
    }

    close = () => {
        window.top.postMessage({ action: C.CloseTinyMessage }, "*");
    }

    tabStyle = (tabId: string) => {
        return this.state.activeTab === tabId ? {} : { display: "none" };
    }

    renderTooltipsTab = () => {
        if (!this.props.config[Opt.TooltipsTab]) return null;
        return (
            <span style={this.tabStyle(tooltipsTabId)}>
                <TinyMCETooltipsTab config={this.props.config} shouldFocus={!this.props.tableHtml} onAdd={this.add} onClose={this.close} />
            </span>
        );
    }

    renderTablesTab = () => {
        if (!this.props.config[Opt.TablesTab]) return null;
        return (
            <span style={this.tabStyle(tablesTabId)}>
                <TinyMCETablesTab onAdd={this.add} onClose={this.close} tableHtml={this.props.tableHtml} />
            </span>
        );
    }

    render() {
        return (
            <div className="bh-tinymce-dialog">
                <Nav bsStyle="tabs" activeKey={this.state.activeTab} onSelect={(activeTab) => this.setState({ activeTab })}>
                    {this.props.config[Opt.TooltipsTab] && <NavItem eventKey={tooltipsTabId} title="Add Tooltips">Tooltips</NavItem>}
                    {this.props.config[Opt.TablesTab] && <NavItem eventKey={tablesTabId} title="Add Rollable Tables">Rollable Tables</NavItem>}
                    {/* <NavDropdown title="Extra">
                    </NavDropdown> */}
                </Nav>
                {this.renderTooltipsTab()}
                {this.renderTablesTab()}
            </div >
        );
    }
}

export default TinyMCEApp;