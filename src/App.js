import React, { useState, useRef, useEffect } from "react";
import { select, hierarchy } from "d3";

import "./App.css";
import data from "./data/initiative_2020_projects_geolocation.json";
import TreeChart from "./TreeChart/TreeChart";

function App() {
  const [property, setProperty] = useState("");

  return (
    <div className="App">
      <TreeChart data={data} />
    </div>
  );
}

export default App;
