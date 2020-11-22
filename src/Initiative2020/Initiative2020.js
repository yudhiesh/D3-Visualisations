import React, { useState } from "react";
import OrganizationTreeChart from "./TreeChart/OrganizationTree";
import Reforestation from "./TreeChart/Reforestation";
import LowCarbonAgriCulture from "./TreeChart/LowCarbonArgiculture";
import TreeChart from "./TreeChart/TreeChart";
import Silvopasture from "./TreeChart/Silvopasture";
import AvoidedDegradationAndDeforestation from "./TreeChart/AvoidedDegradationAndDeforestation";
import Funding from "./TreeChart/Funding";
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
        <option value="reforestation">Reforestation</option>
        <option value="funding">Funding</option>
        <option value="silvopasture">Silvopasture</option>
        <option value="lca">Low Carbon Agriculture</option>
        <option value="adad">Avoided Degradation and Deforestation</option>
      </select>
      {(() => {
        switch (change) {
          case "partners":
            return <OrganizationTreeChart data={data} />;
          case "agroforestry":
            return <TreeChart data={data} />;
          case "reforestation":
            return <Reforestation data={data} />;
          case "lca":
            return <LowCarbonAgriCulture data={data} />;
          case "silvopasture":
            return <Silvopasture data={data} />;
          case "adad":
            return <AvoidedDegradationAndDeforestation data={data} />;
          case "funding":
            return <Funding data={data} />;
          default:
            <h1>Please select something!</h1>;
        }
      })()}
    </div>
  );
};

export default Initiative2020;
