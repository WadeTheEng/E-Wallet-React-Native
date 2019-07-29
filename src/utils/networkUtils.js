import axios from "axios";

function setAuthToken(token) {
  axios.defaults.headers.common["Authorization"] = `Token ${token}`;
}

module.exports = setAuthToken;
