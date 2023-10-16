import "./App.css";
import { Component } from "react";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      certificateData: [],
    };
  }

  API_URL = "http://localhost:5038/";

  componentDidMount() {
    this.refreshCertificateData();
  }

  async refreshCertificateData() {
    fetch(this.API_URL + "api/asswebapp/GetHistory")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ certificateData: data });
      });
  }

  render() {
    const{certificateData}=this.state;
    return (
      <div className="App">
        <h1>Akhanda seva samsthan!!</h1>
        <h3>Certification List</h3>
        {certificateData.map(certificate=>
          <p><b>{certificate.name}</b></p>
          )}
      </div>
    );
  }
}

export default App;
