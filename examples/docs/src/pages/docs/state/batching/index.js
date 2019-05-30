import React, { Component, Fragment } from "react";
import { Link } from "react-stax";
import Page from "../../../../components/Page";
import Browser from "../../../../components/Browser";
import LoaderDemo from "./portals/LoaderDemo";
import content from "./content.md";

export default props => <Page html={content} {...props} />;
