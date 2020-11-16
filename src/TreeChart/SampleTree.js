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

import styles from "../TreeChart/SampleTree.module.css";

const width = 1000;
const height = 1000;

const SampleTreeChart = ({ data }) => {
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
  // Data in nodes is unique but just double-check it here
  const mapDataToTarget = (data) => {
    const links = data["links"];
    const nodes = data["nodes"];

    const sourceToTarget = {
      name: "Source To Target",
      children: [],
    };

    nodes.forEach((d) =>
      sourceToTarget.children.push({ name: d["id"], children: [] })
    );
    for (let i = 0; i < links.length; i++) {
      for (let j = 0; j < sourceToTarget.children.length; j++) {
        if (links[i]["source"] === sourceToTarget.children[j]["name"]) {
          sourceToTarget.children[j].children.push({
            target: links[i]["target"],
          });
        }
      }
    }
    const filteredData = sourceToTarget.children.filter(
      (s) => s.children.length > 0
    );
    const sourceToTarget2 = {
      name: "Source To  Target",
      children: [...filteredData],
    };
    return sourceToTarget2;
  };
  const sourceToTarget = mapDataToTarget(data);
  const previouslyRenderedData = usePrevious(sourceToTarget);

  useEffect(() => {
    const svg = select(svgRef.current);
    console.log(sourceToTarget);

    if (!dimensions) return;

    // const root = hierarchy(sourceToTarget).sort(
    //   (a, b) =>
    //     descending(a.height, b.height) ||
    //     ascending(a.data.source, b.data.source)
    // );

    const root = hierarchy(sourceToTarget);
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
      .text((d) => (d.children ? d.data.name : d.data.target))
      .attr("text-anchor", (d) => (d.children ? "end" : "start"))
      .attr("font-size", (d) => (d.children ? 15 : 14));
  }, [dimensions, previouslyRenderedData]);
  return (
    <div className={styles.root3} ref={wrapperRef}>
      <svg ref={svgRef}></svg>
    </div>
  );
};
export default memo(SampleTreeChart);
