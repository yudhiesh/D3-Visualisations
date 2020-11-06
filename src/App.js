import React, { useState, useRef, useEffect } from "react";
import { select, hierarchy } from "d3";

import styles from "./App.css";
import data from "./data/initiative_2020_projects_geolocation.json";
import TreeChart from "./TreeChart/TreeChart";
import OrganizationTreeChart from "./TreeChart/OrganizationTree";

function App() {
  const [change, setChange] = useState(false);
  console.log(change);
  return (
    <div>
      {change ? (
        <OrganizationTreeChart data={data} />
      ) : (
        <TreeChart data={data} />
      )}
      <button className={styles.button} onClick={() => setChange(!change)}>
        Switch
      </button>
    </div>
  );
}

export default App;
