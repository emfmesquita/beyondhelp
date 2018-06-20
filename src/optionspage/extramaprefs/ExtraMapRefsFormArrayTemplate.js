import React, { Component } from 'react';
import { Button, Tab, Row, Col, Nav, NavItem, Panel } from 'react-bootstrap';

import { StringField } from "react-jsonschema-form";

import OptionButton from "../OptionButton";

const addTitle = (props) => {
    if (!props.schema || !props.schema.add) return "New";
    return `New ${props.schema.add}`;
};

const id = (comp) => comp.props.idSchema["$id"];
const data = (comp, prop) => comp.props.formData[prop] || "";
const arrayItemTile = (props) => {
    if (props.uiSchema && props.uiSchema["ui:arrayItemTitle"]) return props.uiSchema["ui:arrayItemTitle"];
    if (props.title) return props.title.substr(0, props.title.length - 1);
    return "";
};

class ExtraMapRefsFormArrayTemplate extends Component {
    constructor(props) {
        super(props);
        this.itemTitle = arrayItemTile(props);
        this.newTitle = this.itemTitle ? `New ${this.itemTitle}` : "New";
        this.deleteTitle = this.itemTitle ? `Delete ${this.itemTitle}` : "Delete";
    }


    renderTab = (children, idx) => {
        let title = "";
        const arrayTabProp = this.props.uiSchema["ui:arrayTabProp"];
        if (arrayTabProp) {
            title = data(children, arrayTabProp);
        }
        if (!title) {
            title = this.itemTitle ? `${this.itemTitle} ${idx + 1}` : idx + 1;
        }

        return <NavItem key={idx} eventKey={idx}>{title}</NavItem>;
    }

    renderTabPane = (item, idx) => {
        return (
            <Tab.Pane key={idx} eventKey={idx}>
                {item.onDropIndexClick && <OptionButton className="BH-extramaps-object-delete" icon="trash" onClick={item.onDropIndexClick(item.index)} title={this.deleteTitle} />}
                {item.children}
            </Tab.Pane>
        );
    }

    renderObjectArray = () => {
        return (
            <Tab.Container className="BH-extramaps-object-array" id={"BH-extramaps-tab-comp-" + id(this)} defaultActiveKey={0}>
                <Row className="clearfix">
                    <Col sm={12}>
                        <Nav bsStyle="tabs">
                            <NavItem disabled className="BH-extramaps-title">{this.props.title}</NavItem>
                            {this.props.items.map((item, idx) => this.renderTab(item.children, idx))}
                            <OptionButton className="BH-extramaps-add" icon="plus" onClick={this.props.onAddClick} title={this.newTitle} />
                        </Nav>
                    </Col>
                    <Col sm={12}>
                        <Panel>
                            <Panel.Body>
                                <Tab.Content animation>
                                    {this.props.items.map(this.renderTabPane)}
                                </Tab.Content>
                            </Panel.Body>
                        </Panel>
                    </Col>
                </Row>
            </Tab.Container>
        );
    }

    renderSimpleRow = (item, idx) => {
        return (
            <Row key={idx}>
                <div className="BH-extramaps-simple-array-row">
                    {item.children}
                </div>
                {item.onDropIndexClick && <OptionButton className="BH-extramaps-simple-delete" icon="trash" onClick={item.onDropIndexClick(item.index)} title={this.deleteTitle} />}
            </Row>
        );
    }

    renderSimpleArray = () => {
        return (
            <div className="BH-extramaps-simple-array">
                <label className="control-label">{this.props.title}</label>
                <OptionButton className="BH-extramaps-add" icon="plus" onClick={this.props.onAddClick} title={this.newTitle} />
                <Panel>
                    <Panel.Body>
                        {this.props.items.map(this.renderSimpleRow)}
                    </Panel.Body>
                </Panel>
            </div>
        );
    }

    render() {
        if (this.props.schema.items.type === "object") return this.renderObjectArray();
        return this.renderSimpleArray();
    }
}


export default ExtraMapRefsFormArrayTemplate;