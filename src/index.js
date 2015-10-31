import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App";

ReactDOM.render(
  <App width={600}
       height={400}
       margin={15}
       scale={800} />,
  document.getElementById("content")
);