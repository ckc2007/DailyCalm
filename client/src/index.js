import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App";
import ApolloClient from "./utils/ApolloClient";
import reportWebVitals from "./reportWebVitals";

// console.log(localStorage.getItem("token")); // Log the token

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
