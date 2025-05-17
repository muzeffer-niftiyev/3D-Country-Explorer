import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { BrowserRouter } from "react-router-dom";
import Router from "./Router.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
        <Router />
    </Provider>
  </BrowserRouter>
);
