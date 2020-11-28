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
import useResizeObserver from "../useResizeObserver";
import styles from "./Partners.module.css";

const width = 954;

const Partners = ({ data }) => {
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
  const PartnerOrganizations = {
    name: "Partner Organizations",
    children: [
      {
        name: "Technical",
        children: [],
      },
      {
        name: "Financial",
        children: [],
      },
    ],
  };
  const getUniqueOrgs = (data) => {
    data.forEach((d) =>
      d.partner_classification === "Technical"
        ? PartnerOrganizations.children[0].children.push({
            org: d.partner_name,
          })
        : PartnerOrganizations.children[1].children.push({
            org: d.partner_name,
          })
    );
  };
  const previouslyRenderedData = usePrevious(PartnerOrganizations);

  useEffect(() => {
    getUniqueOrgs(data);
    const svg = select(svgRef.current);

    if (!dimensions) return;

    const root = hierarchy(PartnerOrganizations).sort(
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
      .text((d) => (d.children ? d.data.name : d.data.org))
      .attr("text-anchor", (d) => (d.children ? "end" : "start"))
      .attr("font-size", (d) => (d.children ? 15 : 14));
  }, [data, PartnerOrganizations, dimensions, previouslyRenderedData]);
  return (
    <div className={styles.root3} ref={wrapperRef}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default memo(Partners);
