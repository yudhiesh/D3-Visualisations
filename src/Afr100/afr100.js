import React, { useState } from "react";
import technicalPartners from "../data/Technical_partners_afr100_cleaned_final.json";
import financialPartners from "../data/Financial_partners_afr100_cleaned_final.json";
import technicalPartners2 from "../data/Technical_Partners_2.json";
import technicalPartners3 from "../data/Technical_Partners_3.json";
import technicalPartners4 from "../data/Technical_Partners_4.json";
import FinancialPartners from "./FinancialPartners";
import TechnicalPartners from "./TechnicalPartners";
import TechnicalPartners2 from "./TechnicalPartners2";
import TechnicalPartners3 from "./TechnicalPartners3";
import TechnicalPartners4 from "./TecnicalPartners4";
import styles from "../App.css";

const Afr100 = () => {
  const [change, setChange] = useState("financialPartners");
  return (
    <div>
      <select
        className={styles.select}
        value={change}
        onChange={(event) => setChange(event.target.value)}
      >
        <option value="financialPartners">Financial Partners</option>
        <option value="technicalPartners">Technical Partners Part 1</option>
        <option value="technicalPartners2">Technical Partners Part 2</option>
        <option value="technicalPartners3">Technical Partners Part 3</option>
        <option value="technicalPartners4">Technical Partners Part 4</option>
      </select>
      {(() => {
        switch (change) {
          case "financialPartners":
            return <FinancialPartners data={financialPartners} />;
          case "technicalPartners":
            return <TechnicalPartners data={technicalPartners} />;
          case "technicalPartners2":
            return <TechnicalPartners2 data={technicalPartners2} />;
          case "technicalPartners3":
            return <TechnicalPartners3 data={technicalPartners3} />;
          case "technicalPartners4":
            return <TechnicalPartners4 data={technicalPartners4} />;
          default:
            <h1>Please select something!</h1>;
        }
      })()}
    </div>
  );
};

export default Afr100;
