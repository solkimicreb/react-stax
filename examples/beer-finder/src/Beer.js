import React, { Component } from "react";
import { view, store } from "react-easy-stack";
import Card, { CardContent, CardMedia } from "material-ui/Card";

class Beer extends Component {
  store = store({ showDetails: false });
  toggleDetails = () => (this.store.showDetails = !this.store.showDetails);

  render() {
    const { name, image_url: imageUrl, food_pairing, description } = this.props;
    const { showDetails } = this.store;
    return (
      <Card onClick={this.toggleDetails} className="beer">
        {!showDetails && <CardMedia image={imageUrl} className="media" />}
        <CardContent>
          <h3>{name}</h3>
          {showDetails ? (
            <p>{description}</p>
          ) : (
            <ul>{food_pairing.map(food => <li key={food}>{food}</li>)}</ul>
          )}
        </CardContent>
      </Card>
    );
  }
}

export default view(Beer);
