import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-theme.css";
import "./optionspage.scss";

import OptionsApp from "./OptionsApp";
import React from "react";
import { render } from "react-dom";

render(<OptionsApp />, document.getElementById("root"));