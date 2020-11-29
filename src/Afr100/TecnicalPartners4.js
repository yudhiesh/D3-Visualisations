import React, { useEffect, useRef } from "react";
import {
  select,
  hierarchy,
  tree,
  linkHorizontal,
  ascending,
  descending,
  cluster,
} from "d3";

import useResizeObserver from "../useResizeObserver";

import styles from "./TechnicalPartners4.module.css";

const width = 954;

const TechnicalPartners = ({ data }) => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };
  const technicalPartnersData = {
    name: "Technical Partners",
    children: [],
  };
  const getUniqueOrganizations = (data) => {
    const orgList = [];
    data.forEach((d) => orgList.push(d["Name"]));
    // flatten a nested array into a single array
    const mergedArray = [].concat(...orgList);
    // get the unique values from the array
    const uniqueOrgs = [...new Set(mergedArray)];
    uniqueOrgs.forEach((u) =>
      technicalPartnersData.children.push({ name: u, children: [] })
    );
  };
  getUniqueOrganizations(data);
  const focusCountriesData = (data) => {
    for (let i = 0; i < data.length; i++) {
      const orgName = data[i]["Name"];
      const focusCountries = data[i]["Focus Countries"];
      for (let j = 0; j < technicalPartnersData.children.length; j++) {
        if (orgName === technicalPartnersData.children[j]["name"]) {
          for (let k = 0; k < focusCountries.length; k++) {
            technicalPartnersData.children[j].children.push({
              locations: focusCountries[k],
            });
          }
        }
      }
    }
  };

  const previouslyRenderedData = usePrevious(technicalPartnersData);
  useEffect(() => {
    focusCountriesData(data);
    const svg = select(svgRef.current);

    if (!dimensions) return;

    const root = hierarchy(technicalPartnersData).sort(
      (a, b) =>
        descending(a.height, b.height) || ascending(a.data.name, b.data.name)
    );

    root.dx = 12;
    root.dy = width / (root.height + 0.6);
    cluster().nodeSize([root.dx, root.dy])(root);

    const linkGenerator = linkHorizontal()
      .x((node) => node.y)
      .y((node) => node.x);

    svg
      .selectAll(".node")
      .data(root.descendants())
      .join((enter) =>
        enter
          .append("circle")
          .attr("fill", (d) => (d.children ? "#555" : "#999"))
      )
      .attr("r", 2.5)
      .attr("class", "node")
      .attr("cx", (node) => node.y)
      .attr("cy", (node) => node.x)
      .attr("r", 2.5)
      .transition()
      .duration(500)
      .delay((node) => node.depth * 300)
      .attr("opacity", 1);

    // links
    const enteringAndUpdatingLinks = svg
      .selectAll(".path")
      .data(root.links())
      .join("path")
      .attr("class", "link")
      .attr("d", linkGenerator)
      .attr("stroke-dasharray", function() {
        const length = this.getTotalLength();
        return `${length} ${length}`;
      })
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 0.4);

    if (data !== previouslyRenderedData) {
      enteringAndUpdatingLinks
        .attr("stroke-dashoffset", function() {
          return this.getTotalLength();
        })
        .transition()
        .duration(500)
        .delay((link) => link.source.depth * 500)
        .attr("stroke-dashoffset", 5);
    }

    //labels
    svg
      .selectAll(".text")
      .data(root.descendants())
      .join("text")
      .attr("x", (d) => d.y)
      .attr("y", (d) => d.x)
      .attr("dy", "0.31em")
      .attr("dx", (d) => (d.children ? -6 : 6))
      .text((d) => (d.children ? d.data.name : d.data.locations))
      .attr("text-anchor", (d) => (d.children ? "end" : "start"))
      .attr("font-size", (d) => (d.children ? 15 : 14));
  }, [data, technicalPartnersData, dimensions, previouslyRenderedData]);
  return (
    <div className={styles.root3} ref={wrapperRef}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default TechnicalPartners;
