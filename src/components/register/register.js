import React, { Component } from "react";

//components
import Navbar from "../shared/navbar/navbar";

//axios
import axios from "axios";

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: { email: "", name: "", password: "" },
    };
  }

  onTextChange = (e, origin) => {
    let { user } = this.state;
    switch (origin) {
      case "email":
        this.setState({ user: { ...user, email: e.target.value } });
        break;
      case "name":
        this.setState({ user: { ...user, name: e.target.value } });
        break;
      case "password":
        this.setState({ user: { ...user, password: e.target.value } });
        break;
      default:
        break;
    }
  };

  submitRegister = async () => {
    let { user } = this.state;
    let formData = new FormData();

    if (user.email === "" || user.name === "" || user.password === "") {
      alert("Please fill in all fields");
    } else {
      formData.append("email", user.email);
      formData.append("name", user.name);
      formData.append("password", user.password);

      let url = "http://127.0.0.1/CoronaTracker/api/register.php";

      axios({
        method: "post",
        url: url,
        data: formData,
      }).then((response) => {
        if (response.data.status === 200) {
          console.log(response.data);
          alert("Your registration is successful!");
          window.location.href = "/login";
        } else {
          alert("Your registration failed. Please try again later.");
        }
      });
    }
  };

  render() {
    let { user } = this.state;
    return (
      <div>
        <Navbar />
        <br />
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-6 col-md-8 col-sm-12 col-xs-12">
              <h3 className="text-center">Register for an account</h3>
              <br />
              <div className="card">
                <div className="card-body">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      className="form-control"
                      type="email"
                      placeholder="john.apppleseed@apple.com"
                      value={user.email}
                      onChange={(e) => this.onTextChange(e, "email")}
                    />
                  </div>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="John Appleseed"
                      value={user.name}
                      onChange={(e) => this.onTextChange(e, "name")}
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      className="form-control"
                      type="password"
                      value={user.password}
                      onChange={(e) => this.onTextChange(e, "password")}
                    />
                  </div>

                  <button
                    className="btn btn-block btn-success"
                    onClick={() => {
                      this.submitRegister();
                    }}
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
