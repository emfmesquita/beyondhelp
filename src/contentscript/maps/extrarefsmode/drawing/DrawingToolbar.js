import "./DrawingToolbar.scss";

import React, { Component } from "react";

import Command from "./Command";
import DrawingService from "./DrawingService";
import KeyboardService from "../../../../services/KeyboardService";
import ReactDOM from "react-dom";
import { throttle } from 'lodash';

class DrawingToolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dummy: false
        };

        this.commandToClickHandler = {};
        Command.AllCommands.forEach(command => this.commandToClickHandler[command] = this.clickHandler(command));

        const codeToClickHandler = {
            Digit1: this.commandToClickHandler[Command.Rect], // 1
            Digit2: this.commandToClickHandler[Command.Rho], // 2
            Digit3: this.commandToClickHandler[Command.Circ], // 3
            KeyM: this.commandToClickHandler[Command.Move], // m
            KeyD: this.commandToClickHandler[Command.Delete], // d
            KeyS: this.commandToClickHandler[Command.Resize] // s
        };

        KeyboardService.down().noRepeat().codes(...Object.keys(codeToClickHandler)).handler((e) => {
            codeToClickHandler[e.code]();
        });
    }

    clickHandler = (command: number) => {
        const handler = DrawingService.toggleFunc(command);
        return () => {
            handler();
            this.setState({ dummy: !this.state.dummy }); // forces render
        };
    }

    shapeButton = (icon: string, title: string, command: number) => {
        const onClick = this.commandToClickHandler[command];
        const on = DrawingService.isCommandOn(command);
        return (
            <span>
                <span title={title} className={`BH-shape-button${on ? " BH-on" : ""}`} onClick={onClick}>
                    <i className={"fa fa-" + icon} />
                </span>
            </span>
        );
    }

    render() {
        return (
            <div>
                <div className="BH-extra-map-refs-drawing-toolbar">
                    {this.shapeButton("square", "Area (1)", Command.Rect)}
                    {this.shapeButton("gem", "More Info Area (2)", Command.Rho)}
                    {this.shapeButton("circle", "Map to Map Area (3)", Command.Circ)}
                    {this.shapeButton("arrows-alt", "Move Area (m)", Command.Move)}
                    {this.shapeButton("expand-arrows-alt", "Resize Area (s)", Command.Resize)}
                    {this.shapeButton("trash-alt", "Delete Area (d)", Command.Delete)}
                    <span>
                        <span className="BH-extra-map-refs-drawing-coords">0,0</span>
                    </span>
                </div>
            </div>
        );
    }
}

export default DrawingToolbar;