import React, { useState, useRef, useEffect } from "react";
import Initiative2020 from "./Initiative2020/Initiative2020";
import Cities4Forests from "./Cities4Forest/cities";
import AFR100 from "./Afr100/afr100";
import stylesApp from "./App.module.css";

function App() {
  const [page, setPage] = useState("initiative");
  return (
    <div>
      <div className={stylesApp.buttonOrg}>
        <button onClick={() => setPage("afr100")}>AFR100</button>
        <button onClick={() => setPage("cities")}>Cities4Forests</button>
        <button onClick={() => setPage("initiative")}>Initiative2020</button>
      </div>
      <div>
        {page && page === "initiative" ? (
          <Initiative2020 />
        ) : page === "afr100" ? (
          <AFR100 />
        ) : (
          <Cities4Forests />
        )}
      </div>
    </div>
  );
}

export default App;
