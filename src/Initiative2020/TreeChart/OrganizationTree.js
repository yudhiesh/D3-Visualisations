import React, { useRef, useEffect, memo, useMemo } from "react";
import {
  select,
  hierarchy,
  tree,
  linkHorizontal,
  ascending,
  descending,
  cluster,
} from "d3";
import useResizeObserver from "../../useResizeObserver";

import styles from "../TreeChart/OrganizationTree.module.css";

const width = 954;

const OrganizationTreeChart = ({ data }) => {
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

  const partnerOrganization = {
    name: "Partner Organizations",
    children: [
      {
        name: "Partner",
        children: [],
      },
      {
        name: "No Partner",
        children: [],
      },
    ],
  };
  const partnerOrganizationMutation = (data) => {
    const uniqueOrgs = uniquePartnerList(data);

    // add the country with no partnerOrganizations to the no partner obj
    // swap country for locations if looking for locations
    data.forEach((d) =>
      d.partner_organization.length > 0
        ? null
        : partnerOrganization.children[1].children.push({
            locations: d.locations,
          })
    );
    // add each org and a list of children to the main partnerOrganization obj
    uniqueOrgs.forEach((o) =>
      partnerOrganization.children[0].children.push({ name: o, children: [] })
    );

    const uniqueOrgsList = partnerOrganization.children[0].children;

    // Loops over the data
    // finds the organization and appends the country to the uniqueOrgsList
    for (let i = 0; i < data.length; i++) {
      const partOrg = data[i]["partner_organization"];
      const locations = data[i]["locations"];
      // const country = data[i]["country"];
      for (let i = 0; i < partOrg.length; i++) {
        const eachPart = partOrg[i];
        for (let i = 0; i < uniqueOrgsList.length; i++) {
          if (eachPart === uniqueOrgsList[i]["name"]) {
            uniqueOrgsList[i]["children"].push({
              locations: locations,
            });
          }
        }
      }
    }
  };

  const uniquePartnerList = (data) => {
    const orgList = [];
    data.forEach((d) =>
      d.partner_organization.length > 0
        ? orgList.push(d.partner_organization)
        : null
    );
    // flatten a nested array into a single array
    const mergedArray = [].concat(...orgList);
    // get the unique values from the array
    const uniqueOrgs = [...new Set(mergedArray)];
    return uniqueOrgs;
  };

  // to flip from horizontal to vertical or vice versa
  // swap values height, width & x , y
  // swap linkHorizontal and linkVertical

  const previouslyRenderedData = usePrevious(partnerOrganization);

  useEffect(() => {
    partnerOrganizationMutation(data);
    console.log(partnerOrganization);

    const svg = select(svgRef.current);

    if (!dimensions) return;

    const root = hierarchy(partnerOrganization).sort(
      (a, b) =>
        descending(a.height, b.height) || ascending(a.data.name, b.data.name)
    );

    root.dx = 12;
    root.dy = width / (root.height + 1);
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
  }, [data, partnerOrganization, dimensions, previouslyRenderedData]);
  return (
    <div className={styles.root3} ref={wrapperRef}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default memo(OrganizationTreeChart);
