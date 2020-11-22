import React, { useState } from "react";
import OrganizationTreeChart from "./TreeChart/OrganizationTree";
import TreeChart from "./TreeChart/TreeChart";
import data from "../data/initiative_2020_projects_geolocation.json";
import styles from "../App.css";

const Initiative2020 = () => {
  const [change, setChange] = useState("agroforestry");
  return (
    <div>
      <select
        className={styles.select}
        value={change}
        onChange={(event) => setChange(event.target.value)}
      >
        <option value="agroforestry">Agroforestry</option>
        <option value="partners">Partners</option>
      </select>
      {change === "agroforestry" ? (
        <OrganizationTreeChart data={data} />
      ) : (
        <TreeChart data={data} />
      )}
    </div>
  );
};

export default Initiative2020;
