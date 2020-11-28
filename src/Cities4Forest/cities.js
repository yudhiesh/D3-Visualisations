import React from "react";
import partnersData from "../data/cities4forest_partners_to_merge_nlp.json";
import Partners from "./Partners";

const Cities = () => {
  return (
    <div>
      <Partners data={partnersData} />
    </div>
  );
};

export default Cities;
