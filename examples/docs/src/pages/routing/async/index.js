import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { BasicLink as Link } from "../../../components/Link";
import Page from "../../../components/Page";
import Browser from "../../../components/Browser";
import StartingParamsDemo from "./portals/StartingParamsDemo";
import ParamsDemo from "./portals/ParamsDemo";
import content from "./content.md";

export default () => (
  <Page html={content} {...this.props}>
    <Link to="../integrations">integrations docs</Link>
    <Browser mount="starting-params-demo">{StartingParamsDemo}</Browser>
    <Browser mount="params-demo">{ParamsDemo}</Browser>
  </Page>
);
