import React, { Component } from "react";

class Card extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="card" style={this.props.card}>
        <div className="card-body" style={this.props.cardBody}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Card;
