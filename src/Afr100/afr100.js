import React, { useState } from "react";
import technicalPartners from "../data/Technical_partners_afr100_cleaned_final.json";
import financialPartners from "../data/Financial_partners_afr100_cleaned_final.json";
import FinancialPartners from "./FinancialPartners";
import TechnicalPartners from "./TechnicalPartners";
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
        <option value="technicalPartners">Technical Partners</option>
      </select>
      {(() => {
        switch (change) {
          case "financialPartners":
            return <FinancialPartners data={financialPartners} />;
          case "technicalPartners":
            return <TechnicalPartners data={technicalPartners} />;
          default:
            <h1>Please select something!</h1>;
        }
      })()}
    </div>
  );
};

export default Afr100;
