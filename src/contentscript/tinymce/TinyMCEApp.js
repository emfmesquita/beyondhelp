import 'react-select/dist/react-select.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './TinyMCEApp.scss';

import { MenuItem, Nav, NavDropdown, NavItem } from 'react-bootstrap';
import React, { Component } from 'react';

import C from "../../Constants";
import MessageService from "../../services/MessageService";
import TinyMCETablesTab from "./TinyMCETablesTab";
import TinyMCETooltipsTab from "./TinyMCETooltipsTab";

const tooltipsTabId = "tooltips";
const tablesTabId = "tables";

class TinyMCEApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: props.tableHtml ? tablesTabId : tooltipsTabId
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

    render() {
        return (
            <div className="bh-tinymce-dialog">
                <Nav bsStyle="tabs" activeKey={this.state.activeTab} onSelect={(activeTab) => this.setState({ activeTab })}>
                    <NavItem eventKey={tooltipsTabId} title="Add Tooltips">Tooltips</NavItem>
                    <NavItem eventKey={tablesTabId} title="Add Rollable Tables">Rollable Tables</NavItem>
                    {/* <NavDropdown title="Extra">
                    </NavDropdown> */}
                </Nav>
                <span style={this.tabStyle(tooltipsTabId)}>
                    <TinyMCETooltipsTab
                        addHomebrew={this.props.addHomebrew} addCustom={this.props.addCustom}
                        shouldFocus={!this.props.tableHtml} onAdd={this.add} onClose={this.close}
                    />
                </span>
                <span style={this.tabStyle(tablesTabId)}>
                    <TinyMCETablesTab onAdd={this.add} onClose={this.close} tableHtml={this.props.tableHtml} />
                </span>
            </div >
        );
    }
}

export default TinyMCEApp;