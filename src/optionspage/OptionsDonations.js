import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

class OptionsDonations extends Component {
    renderLink = (icon: string, title: string, link: string) => {
        return (
            <a title={title} href={link} target="_blank">
                <i className={"fa fa-" + icon} />
            </a>
        );
    }

    render() {
        return (
            <div>
                <p>Hi, Kabalistus here. I will let my paypal and patreon in case you want to help the developer behind Beyond Help.</p>
                <p>It will help to buy new released books and give an extra motivation boost.</p>
                <p>This is not my only freetime project, but it is for sure the one I give more attention.</p>
                <p>
                    <strong>Paypal</strong>
                    <a title="Paypal" href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=UPRNYGYKP6NUC&source=url" target="_blank">
                        <img style={{ marginLeft: "18px" }} src={"chrome-extension://" + chrome.runtime.id + "/webaccessible/donations/paypal.gif"} />
                    </a>
                </p>
                <p>
                    <strong>Patreon</strong>
                    <a title="Patreon" href="https://www.patreon.com/kabalistus" target="_blank">
                        <img style={{ height: "30px", marginLeft: "12px" }} src={"chrome-extension://" + chrome.runtime.id + "/webaccessible/donations/patreon.png"} />
                    </a>
                </p>
            </div>
        );
    }
}

export default OptionsDonations;