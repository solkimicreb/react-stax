import React, { Component } from "react";
import { view } from "react-easy-stack";
import { Card, CardHeader, CardText } from "material-ui/Card";

class CardExampleWithAvatar extends Component {
  componentDidCatch(error, info) {
    console.log("PROFILE", error, info);
  }

  render() {
    const { style } = this.props;

    return (
      <div style={style}>
        {[1, 2, 3, 4, 5].map(val => (
          <Card key={val}>
            <CardHeader
              title="Profile"
              subtitle="Your User Profile"
              avatar="http://www.planwallpaper.com/static/images/2ba7dbaa96e79e4c81dd7808706d2bb7_large.jpeg"
            />
            <CardText>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              mattis pretium massa. Aliquam erat volutpat. Nulla facilisi. Donec
              vulputate interdum sollicitudin. Nunc lacinia auctor quam sed
              pellentesque. Aliquam dui mauris, mattis quis lacus id,
              pellentesque lobortis odio.!!!!!
            </CardText>
          </Card>
        ))}
      </div>
    );
  }
}

export default CardExampleWithAvatar;
