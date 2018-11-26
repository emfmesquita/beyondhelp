import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

const socialTitles = {
    "d-and-d-beyond": "D&D Beyond",
    github: "GitHub",
    twitter: "Twitter",
    twitch: "Twitch"
};

const content = [
    {
        name: "Kabalistus",
        socials: [
            { social: "d-and-d-beyond", link: "https://www.dndbeyond.com/members/Kabalistus/" },
            { social: "github", link: "https://github.com/emfmesquita/" },
            { social: "twitter", link: "https://twitter.com/kabalistus/" },
            { social: "twitch", link: "https://www.twitch.tv/kabalistus/" }
        ],
        description: "Lead Programmer"
    },
    {
        name: "Gludington",
        socials: [
            { social: "d-and-d-beyond", link: "https://www.dndbeyond.com/members/gludington/" },
            { social: "github", link: "https://github.com/gludington" }
        ],
        description: "Play by Post Notes Feature"
    },
    {
        name: "Dconman",
        socials: [
            { social: "d-and-d-beyond", link: "https://www.dndbeyond.com/members/dconman2/" },
            { social: "github", link: "https://github.com/dconman" }
        ],
        description: "Table of Contents on Side Menu Feature"
    },
    {
        name: "Zeg-io",
        socials: [
            { social: "github", link: "https://github.com/zeg-io" }
        ],
        description: "Character Folder Layout and Monster CR Idea and Layout"
    }
];


class OptionsCredits extends Component {

    renderSocial = ({ social, link }) => {
        return (
            <a key={social} title={socialTitles[social]} href={link} target="_blank">
                <i className={"fa fa-" + social} />
            </a>
        );
    }

    renderSocials = (socials) => {
        if (!socials) return null;
        return socials.map(this.renderSocial);
    }

    renderRow = (entry) => {
        return (
            <Row key={entry.name}>
                <Col xs={4} md={1} className="BH-credits-text-col">
                    <strong>{entry.name}</strong>
                </Col>
                <Col xs={4} md={3}>{this.renderSocials(entry.socials)}</Col>
                <Col xs={4} md={8} className="BH-credits-text-col">{entry.description}</Col>
            </Row>
        );
    }

    render() {
        return (
            <Grid className="BH-credits">
                {content.map(this.renderRow)}
                <Row key="community">
                    <Col xs={4} md={1}>
                        <strong>Community</strong>
                    </Col>
                    <Col xs={8} md={11}>Thanks for using the extension, findings bugs and always giving cool ideas for new features and improvements.</Col>
                </Row>
            </Grid>
        );
    }
}

export default OptionsCredits;