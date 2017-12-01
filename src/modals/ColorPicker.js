import React, { Component } from "react";

import ColorService from "../services/ColorService";
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";

class ColorPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayColorPicker: false
        };
    }

    render() {
        const styles = reactCSS({
            "default": {
                color: {
                    height: "100%",
                    borderRadius: "2px",
                    backgroundImage: ColorService.progressBarBackground(this.props.color)
                },
                container: {
                    height: "32px",
                    width: "100%",
                    border: "1px solid #ccc"
                },
                swatch: {
                    padding: "8px",
                    background: "#fff",
                    display: "inline-block",
                    height: "100%",
                    width: "100%",
                    cursor: "pointer"
                },
                popover: {
                    position: "absolute",
                    left: "0px",
                    zIndex: "2"
                }
            }
        });

        return (
            <div style={styles.container} title="Click to Toggle Color Picker">
                <div style={styles.swatch} onClick={this.props.onTogglePicker}>
                    <div style={styles.color} />
                </div>
                {this.props.showPicker ? <div style={styles.popover}>
                    <SketchPicker
                        disableAlpha
                        width={210}
                        presetColors={this.props.presetColors}
                        color={this.props.color}
                        onChange={this.props.onChange}
                    />
                </div> : null}
            </div>
        );
    }
}

export default ColorPicker;