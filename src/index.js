import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App";

ReactDOM.render(
  <App width={800}
       height={500}
       margin={15}
       scale={1000} />,
  document.getElementById("content")
);