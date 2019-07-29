import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import { persistStore, autoRehydrate } from "redux-persist";
import { AsyncStorage } from "react-native";
import axios from "axios";
import axiosMiddleware from "redux-axios-middleware";
import reducers from "../reducers";
import promise from "./promise";
import array from "./array";
import setAuthToken from "../utils/networkUtils";
import { getAuthToken } from "../utils/localStorage";
import { API_URL } from "../utils/config";

const isDebuggingInChrome = true;

const client = axios.create({
  baseURL: API_URL,
  responseType: "json",
  headers: {
    "Content-type": "application/json"
  }
});

const logger = createLogger({
  predicate: (getState, action) => isDebuggingInChrome,
  collapsed: true,
  duration: true
});

async function initAuthHeader() {
  const _token = await getAuthToken();
  if (_token !== null) setAuthToken(_token);
  //console.log(_token);
}

initAuthHeader();

client.interceptors.request.use(request => {
  console.log("Starting Request", request);
  return request;
});

client.interceptors.response.use(response => {
  console.log("Response:", response);
  return response;
});
/*const createAppStore = applyMiddleware(thunk, promise, array, logger)(
  createStore
);*/

async function configureStore(onComplete: () => void) {
  const store = createStore(
    reducers,
    applyMiddleware(axiosMiddleware(client), logger)
  );
  persistStore(store, null, () => onComplete());

  if (isDebuggingInChrome) {
    window.store = store;
  }
  return store;
}

module.exports = configureStore;
