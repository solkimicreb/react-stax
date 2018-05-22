import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { view, storage, params, path, Link } from "react-easy-stack";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import Zoom from "@material-ui/core/Zoom";
import appStore from "./appStore";
import Product from "./Product";

const pageStyle = {
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  padding: "inherit"
};

const listStyle = {
  display: "flex",
  alignItems: "stretch",
  justifyContent: "space-around",
  flexWrap: "wrap",
  margin: "0 -15px"
};

const addButtonStyle = {
  position: "fixed",
  right: 20,
  bottom: 20
};

const notFoundStyle = {
  textAlign: "center",
  textTransform: "uppercase",
  marginTop: 30
};

function ProductList() {
  const { isLoggedIn, products } = appStore;

  return (
    <div style={pageStyle}>
      {products.length ? (
        <div style={listStyle}>
          {products.map(product => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <h3 style={notFoundStyle}>No products found</h3>
      )}
      {isLoggedIn &&
        ReactDOM.createPortal(
          <Zoom in={path[0] === "products"}>
            <Link to="/product" style={addButtonStyle}>
              <Button color="primary" variant="fab">
                <AddIcon />
              </Button>
            </Link>
          </Zoom>,
          document.getElementById("action-button")
        )}
    </div>
  );
}

export default view(ProductList);
