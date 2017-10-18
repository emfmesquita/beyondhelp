import React, { Component } from 'react';
import { Overlay, Popover } from 'react-bootstrap';
import './MonsterHpBarPop.css';

class MonsterHpBarPop extends Component {
    static get FadeTime() {
        return 2000;
    }

    constructor(props) {
        super(props);
    }

    render() {
        const colorClass = this.props.hpChange > 0 ? "Monster-hp-pop-heal" : this.props.hpChange < 0 ? "Monster-hp-pop-damage" : "";
        const valueToShow = this.props.hpChange > 0 ? `+${this.props.hpChange}` : `${this.props.hpChange}`;

        const overlayProps = {
            target: this.props.target,
            show: this.props.show,
            rootClose: true,
            onHide: this.props.onHide,
            placement: "top"
        };

        return (
            <Overlay {...overlayProps}>
                <Popover id={`popover-${this.props.idProp}`} className={this.props.fade ? "Monster-hp-pop-fade" : "Monster-hp-pop-in"}>
                    <span className={`Monster-hp-pop ${colorClass}`}>{valueToShow}</span>
                </Popover>
            </Overlay>
        );
    }
}

export default MonsterHpBarPop;