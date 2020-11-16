import React, { useState, useRef, useEffect } from "react";
import { select, hierarchy } from "d3";

import styles from "./App.css";
import data from "./data/initiative_2020_projects_geolocation.json";
import sampleData from "./data/sample_graph.json";
import TreeChart from "./TreeChart/TreeChart";
import OrganizationTreeChart from "./TreeChart/OrganizationTree";
import SampleTree from "./TreeChart/SampleTree";

function App() {
  const [change, setChange] = useState("agroforestry");
  return (
    <div>
      <SampleTree data={sampleData} />
      {/* <select */}
      {/*   className={styles.select} */}
      {/*   value={change} */}
      {/*   onChange={(event) => setChange(event.target.value)} */}
      {/* > */}
      {/*   <option value="agroforestry">Agroforestry</option> */}
      {/*   <option value="partners">Partners</option> */}
      {/* </select> */}
      {/* {change === "agroforestry" ? ( */}
      {/*   <OrganizationTreeChart data={data} /> */}
      {/* ) : ( */}
      {/*   <TreeChart data={data} /> */}
      {/* )} */}
    </div>
  );
}

export default App;
