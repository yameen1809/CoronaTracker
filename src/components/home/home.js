import React, { Component } from "react";

import Navbar from "../shared/navbar/navbar.js";
import "./style.css";

import axios from "axios";
import FlagIcon from "../../flagicon";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      country: [],
    };
  }

  componentDidMount() {
    this.fetchCountry();
  }

  fetchCountry = async () => {
    let url = "http://api.coronatracker.com/v3/stats/worldometer/country";

    axios({
      method: "get",
      url: url,
    }).then((response) => {
      if (response.status === 200 || response.status === 201) {
        let country = response.data;
        //console.log(country);

        country = country.map((item, index) => {
          let cc = "";
          if (item.countryCode) {
            cc = item.countryCode.toLowerCase();
          }
          return {
            countryCode: cc,
            countryName: item.country,
            confirm: item.totalConfirmed,
            recovered: item.totalRecovered,
            deaths: item.totalDeaths,
          };
        });
        //console.log(country);
        this.setState({
          country,
        });
      } else {
        alert(
          "Error! Something happened wrong! Please refresh or try again later!"
        );
      }
    });
  };

  renderCountries = () => {
    let { country } = this.state;
    return country.map((item, index) => {
      return (
        <tr key={index}>
          <td>
            <a href={"/country/" + item.countryCode}>
              {item.countryCode &&
                item.countryCode !== "ot" &&
                item.countryCode !== "xk" && (
                  <FlagIcon code={item.countryCode} />
                )}{" "}
              {item.countryName}
            </a>
          </td>
          <td>{item.confirm}</td>
          <td>{item.recovered}</td>
          <td>{item.deaths}</td>
        </tr>
      );
    });
  };

  renderTable = () => {
    return (
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th>Country</th>
            <th>Confirmed</th>
            <th>Recovered</th>
            <th>Deaths</th>
          </tr>
        </thead>
        <tbody>{this.renderCountries()}</tbody>
      </table>
    );
  };

  render() {
    return (
      <div>
        {" "}
        <Navbar />
        <br />
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              {this.renderTable()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
