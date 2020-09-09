import React, { Component } from "react";

//Apex Charts Library
import Chart from "react-apexcharts";

//material ui icons
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import FlagIcon from "../../flagicon";

//components
import Card from "../card/card";
import Navbar from "../shared/navbar/navbar";

//axios
import axios from "axios";

class Country extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //for fourteen days selection - 0 = barchart, 1 = areachart, 2= linechart
      fourteenDaysSelection: 0,
      country: {
        countryCode: "bd",
        country: "Bangladesh",
        totalDeaths: 0,
        totalConfirmed: 0,
        totalRecovered: 0,
        totalCritical: 0,
        activeCases: 0,
      },
      fourteenDays: [],
    };
  }

  componentDidMount() {
    this.fetchCountry();
    this.fetchFourteenDays();
  }

  fetchCountry = async () => {
    let { match } = this.props;
    let countryCode = match.params.id;

    let url =
      "http://api.coronatracker.com/v3/stats/worldometer/country?countryCode=" +
      countryCode;

    axios({
      method: "get",
      url: url,
    }).then((response) => {
      if (response.status === 200 || response.status === 201) {
        let country = response.data[0];
        this.setState({ country });
      } else {
        alert(
          "Error! Something happened wrong! Please refresh or try again later!"
        );
      }
    });
  };

  fetchFourteenDays = async () => {
    let { match } = this.props;
    let countryCode = match.params.id;
    var fortnightBefore = new Date(Date.now() - 12096e5);
    //YYYY-MM-DD - Start Date
    let startDate =
      fortnightBefore.getFullYear() +
      "-" +
      (fortnightBefore.getMonth() + 1 > 10
        ? fortnightBefore.getMonth() + 1
        : "0" + (fortnightBefore.getMonth() + 1)) +
      "-" +
      (fortnightBefore.getDate() > 10
        ? fortnightBefore.getDate()
        : "0" + fortnightBefore.getDate());

    //End Date
    let d = new Date();
    let endDateObj = d.setDate(d.getDate() - 1);
    endDateObj = new Date();
    let endDate =
      endDateObj.getFullYear() +
      "-" +
      (endDateObj.getMonth() + 1 > 10
        ? endDateObj.getMonth() + 1
        : "0" + (endDateObj.getMonth() + 1)) +
      "-" +
      (endDateObj.getDate() > 10
        ? endDateObj.getDate()
        : "0" + endDateObj.getDate());

    let url =
      "http://api.coronatracker.com/v3/analytics/trend/country?countryCode=" +
      countryCode +
      "&startDate=" +
      startDate +
      "&endDate=" +
      endDate;

    axios({
      method: "get",
      url: url,
    }).then((response) => {
      if (response.status === 200 || response.status === 201) {
        this.setState({
          fourteenDays: response.data,
        });
      } else {
        alert(
          "Error! Something happened wrong! Please refresh or try again later!"
        );
      }
    });
  };

  renderOverView = () => {
    let { country } = this.state;
    return (
      <div className="row">
        <div className="col-auto mr-auto">
          <h5>
            <strong>
              {" "}
              <FlagIcon code={country.countryCode.toLowerCase()} />{" "}
              {country.country} Overview
            </strong>
          </h5>
        </div>
        <div className="col-auto">
          <p>
            <span style={{ position: "relative", top: "-5px" }}>Share </span>{" "}
            <FacebookIcon className="fb" /> <TwitterIcon className="tw" />
          </p>
        </div>
      </div>
    );
  };

  renderStats = () => {
    let { country } = this.state;
    return (
      <div className="row text-center">
        <div className="col-4">
          <h4 className="txtRed">
            <b>{country.totalConfirmed}</b>
          </h4>
          <p className="txtGray">
            <b>Confirmed</b>
            <p className="subtitle txtRed">
              <b>+ {country.dailyConfirmed} new cases</b>
            </p>
          </p>
        </div>
        <div className="col-4">
          <h4 className="txtGreen">
            <b>{country.totalRecovered}</b>
          </h4>
          <p className="txtGray">
            <b>Recovered</b>
          </p>
        </div>
        <div className="col-4">
          <h4 className="txtGray">
            <b>{country.totalDeaths}</b>
          </h4>
          <p className="txtGray">
            <b>Deaths</b>
            <p className="subtitle txtGray">
              <b>+ {country.dailyDeaths} new deaths</b>
            </p>
          </p>
        </div>
      </div>
    );
  };

  renderFatalityCard = () => {
    let { country } = this.state;
    let series = [country.totalDeaths, country.totalConfirmed];
    let deadPercentage = (country.totalDeaths / series[1]) * 100;
    let options = {
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          startAngle: 0,
          expandOnClick: false,
          offsetX: 0,
          offsetY: 0,
          customScale: 1,
          dataLabels: {
            offset: 0,
            minAngleToShowLabel: 10,
          },
          donut: {
            size: "85%",
            background: "transparent",
            labels: {
              show: false,
            },
          },
        },
      },
      fill: {
        colors: ["rgb(255,154,178)", "rgb(204,204,204)"],
      },
      tooltip: {
        enabled: false,
      },
      states: {
        normal: {
          filter: {
            type: "none",
            value: 0,
          },
        },
        hover: {
          filter: {
            type: "none",
            value: 0,
          },
        },
        active: {
          filter: {
            type: "none",
            value: 0,
          },
        },
      },
      chart: {
        selection: {
          enabled: false,
        },
        offsetY: -10,
      },
      title: {
        text: deadPercentage.toFixed(1) + "%",
        align: "center",
        margin: 10,
        offsetX: 0,
        offsetY: 55,
        floating: true,
        style: {
          fontSize: "20px",
          fontWeight: 300,
          fontFamily: "Arial",
          color: "#263238",
        },
      },
      subtitle: {
        text: "OF TOTAL CASES",
        align: "center",
        margin: 10,
        offsetX: 0,
        offsetY: 85,
        floating: true,
        style: {
          fontSize: "8px",
          fontWeight: "normal",
          fontFamily: "Arial",
          color: "#9699a2",
        },
      },
    };

    return (
      <div
        className="row align-items-center no-gutters"
        style={{ height: "100%" }}
      >
        <div className="col-lg-6 col-md-6">
          <Chart
            options={options}
            series={series}
            type="donut"
            width="100%"
            height="150px"
          />
        </div>
        <div className="col-lg-6 col-md-6 text-center">
          <p>
            <b>Fatality Rate</b>
          </p>
        </div>
      </div>
    );
  };

  renderRecoveryCard = () => {
    let { country } = this.state;
    let series = [
      country.totalConfirmed - country.totalRecovered,
      country.totalConfirmed,
    ];
    let recoveryPercentage = (country.totalRecovered / series[1]) * 100;
    let options = {
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          startAngle: 0,
          expandOnClick: false,
          offsetX: 0,
          offsetY: 0,
          customScale: 1,
          dataLabels: {
            offset: 0,
            minAngleToShowLabel: 10,
          },
          donut: {
            size: "85%",
            background: "transparent",
            labels: {
              show: false,
            },
          },
        },
      },
      fill: {
        colors: ["dodgerblue", "rgb(204,204,204)"],
      },
      tooltip: {
        enabled: false,
      },
      states: {
        normal: {
          filter: {
            type: "none",
            value: 0,
          },
        },
        hover: {
          filter: {
            type: "none",
            value: 0,
          },
        },
        active: {
          filter: {
            type: "none",
            value: 0,
          },
        },
      },
      chart: {
        selection: {
          enabled: false,
        },
        offsetY: -10,
      },
      title: {
        text: recoveryPercentage.toFixed(1) + "%",
        align: "center",
        margin: 10,
        offsetX: 0,
        offsetY: 55,
        floating: true,
        style: {
          fontSize: "20px",
          fontWeight: 300,
          fontFamily: "Arial",
          color: "#263238",
        },
      },
      subtitle: {
        text: "OF TOTAL CASES",
        align: "center",
        margin: 10,
        offsetX: 0,
        offsetY: 85,
        floating: true,
        style: {
          fontSize: "8px",
          fontWeight: "normal",
          fontFamily: "Arial",
          color: "#9699a2",
        },
      },
    };
    return (
      <div
        className="row align-items-center no-gutters"
        style={{ height: "100%" }}
      >
        <div className="col-lg-6 col-md-6">
          <Chart
            options={options}
            series={series}
            type="donut"
            width="100%"
            height="150px"
          />
        </div>
        <div className="col-lg-6 col-md-6 text-center">
          <p>
            <strong>Recovery Rate</strong>
          </p>
        </div>
      </div>
    );
  };

  renderFirstThreeCards = () => {
    return (
      <div className="row">
        <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 mb-10 paddingHorizontal5">
          <Card>
            {this.renderOverView()}
            {this.renderStats()}
          </Card>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-10 paddingHorizontal5">
          <Card card={{ height: "100%" }} cardBody={{ padding: 0 }}>
            {this.renderFatalityCard()}
          </Card>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-10 paddingHorizontal5">
          <Card card={{ height: "100%" }} cardBody={{ padding: 0 }}>
            {this.renderRecoveryCard()}
          </Card>
        </div>
      </div>
    );
  };

  renderSecondThreeCardsBG = (title, stat, description) => {
    //chart data
    //return chart component and also accept 3 parameters.
    // do positioning on the data and the charts.{
    let options = {
      chart: {
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        labels: {
          show: false,
        },
      },
      yaxis: {
        show: false,
      },
      grid: {
        show: false,
      },
      markers: {
        size: 0,
      },
      stroke: {
        show: true,
        curve: "smooth",
        color: ["rgb(0,180,251)"],
      },
      states: {
        normal: {
          filter: {
            type: "none",
            values: 0,
          },
        },
        hover: {
          filters: {
            type: "lighten",
            value: 0.15,
          },
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: "darken",
            value: 0.35,
          },
        },
      },
      fill: {
        colors: ["rgb(0,180,251)"],
        opacity: 0.9,
      },
    };
    let series = [
      {
        name: "series-1",
        data: [0, 30, 40, 70, 30, 100, 50, 120, 130, 160],
      },
    ];
    return (
      <div>
        <p style={{ position: "absolute", top: 15, left: 15 }}>
          <strong>{title}</strong>
        </p>
        <p style={{ position: "absolute", top: 55, left: 15, fontSize: 25 }}>
          <strong>{stat}</strong>
        </p>
        {description}
        <Chart
          options={options}
          series={series}
          type="area"
          width="100%"
          height="100%"
          style={{ position: "relative", right: -10, bottom: -20 }}
        />
      </div>
    );
  };

  renderSecondThreeCards = () => {
    let { country } = this.state;
    let icuPercentage = (country.totalCritical / country.totalConfirmed) * 100;
    let activeCasesPercentage =
      (country.activeCases / country.totalConfirmed) * 100;
    return (
      <div className="row">
        <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12 mb-10 paddingHorizontal5">
          <Card cardBody={{ padding: 0 }}>
            {this.renderSecondThreeCardsBG(
              "Critical Cases treated in ICU",
              country.totalCritical,
              <p
                style={{
                  position: "absolute",
                  bottom: 42,
                  left: 15,
                  zIndex: 999,
                }}
              >
                <strong>
                  <span style={{ color: "red" }}>
                    {icuPercentage.toFixed(1)}%
                  </span>{" "}
                  of total cases
                </strong>
              </p>
            )}
          </Card>
        </div>
        <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12 mb-10 paddingHorizontal5">
          <Card cardBody={{ padding: 0 }}>
            {this.renderSecondThreeCardsBG(
              "Daily Cases Receiving Treatment",
              country.activeCases,
              <p
                style={{
                  position: "absolute",
                  bottom: 42,
                  left: 15,
                  zIndex: 999,
                }}
              >
                <strong>
                  <span style={{ color: "red" }}>
                    {activeCasesPercentage.toFixed(1)}%
                  </span>{" "}
                  of total cases
                </strong>
              </p>
            )}
          </Card>
        </div>
        <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12 mb-10 paddingHorizontal5">
          <Card cardBody={{ padding: 0 }}>
            {this.renderSecondThreeCardsBG(
              "Daily Confirmed Cases",
              country.totalConfirmedPerMillionPopulation,
              <p
                style={{
                  position: "absolute",
                  bottom: 42,
                  left: 15,
                  zIndex: 999,
                }}
              >
                <strong>Per Million Population</strong>
              </p>
            )}
          </Card>
        </div>
      </div>
    );
  };

  renderFourteenDaysChart = (type) => {
    //stacked stats
    let { fourteenDays } = this.state;
    let confirmArray = [];
    let recoveredArray = [];
    let deathArray = [];
    let dateArray = [];

    fourteenDays.map((item, index) => {
      confirmArray.push(item.total_confirmed);
      recoveredArray.push(item.total_recovered);
      deathArray.push(item.total_deaths);
      let date = new Date(item.last_updated);
      let formatDate =
        date.getUTCMonth() +
        1 +
        "/" +
        date.getUTCDate() +
        "/" +
        date.getUTCFullYear();
      dateArray.push(formatDate);
    });

    let series = [
      {
        name: "Confirmed",
        data: confirmArray,
      },
      {
        name: "Recovered",
        data: recoveredArray,
      },
      {
        name: "Death",
        data: deathArray,
      },
    ];
    let options = {
      chart: {
        stacked: type === "bar" ? true : false,
        toolbar: {
          show: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      xaxis: {
        type: "datetime",
        categories: dateArray,
      },
      yaxis: {
        opposite: true,
      },
      legend: {
        position: "bottom",
      },
      fill: {
        opacity: 0.75,
      },
      grid: {
        show: false,
      },
    };
    return (
      <Chart
        series={series}
        options={options}
        width="100%"
        height="340"
        type={type}
      />
    );
  };

  renderThirdLargestCard = () => {
    let { fourteenDaysSelection } = this.state;

    return (
      <div className="row">
        <div className="col mb-10 paddingHorizontal5">
          <Card>
            <h5>
              <strong>Past 14 Days Chart</strong>
            </h5>
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle fourteenDaysDropdown"
                type="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <b>{fourteenDaysSelection === 0 && "Bar Chart"}</b>
                <b>{fourteenDaysSelection === 1 && "Area Chart"}</b>
                <b>{fourteenDaysSelection === 2 && "Line Chart"}</b>
              </button>
              <div
                className="dropdown-menu fourteenDaysMenuItem"
                aria-labelledby="dropdownMenuButton"
              >
                <a
                  className="dropdown-item"
                  onClick={() => this.setState({ fourteenDaysSelection: 0 })}
                >
                  Bar
                </a>
                <a
                  className="dropdown-item"
                  onClick={() => this.setState({ fourteenDaysSelection: 1 })}
                >
                  Area
                </a>
                <a
                  className="dropdown-item"
                  onClick={() => this.setState({ fourteenDaysSelection: 2 })}
                >
                  Line
                </a>
              </div>
            </div>
            {fourteenDaysSelection === 0 && this.renderFourteenDaysChart("bar")}
            {fourteenDaysSelection === 1 &&
              this.renderFourteenDaysChart("area")}
            {fourteenDaysSelection === 2 &&
              this.renderFourteenDaysChart("line")}
          </Card>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div>
        <Navbar />
        <br />
        <div className="container padding-10">
          {this.renderFirstThreeCards()}
          {this.renderSecondThreeCards()}
          {this.renderThirdLargestCard()}
        </div>
      </div>
    );
  }
}

export default Country;
