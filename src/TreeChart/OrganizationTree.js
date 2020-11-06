import React, { useRef, useEffect, memo, useMemo } from "react";
import { select, hierarchy, tree, linkHorizontal } from "d3";
import useResizeObserver from "../useResizeObserver";

import styles from "../TreeChart/OrganizationTree.module.css";

const OrganizationTreeChart = ({ data }) => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  const partnerOrganization = {
    name: "Partner Organizations",
    children: []
  };

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }
  const partnerOrganizationOnly = data => {
    data.forEach(d =>
      d.partner_organization.length > 0
        ? partnerOrganization.children.push(d)
        : null
    );
  };

  // to flip from horizontal to vertical or vice versa
  // swap values height, width & x , y
  // swap linkHorizontal and linkVertical
  const previouslyRenderedData = usePrevious(partnerOrganization);

  const width = 954;

  useEffect(() => {
    partnerOrganizationOnly(data);
    const svg = select(svgRef.current);
    if (!dimensions) return;
    const root = hierarchy(partnerOrganization);
    root.dx = 12;
    root.dy = width / (root.height + 1);
    tree().nodeSize([root.dx, root.dy])(root);
    const linkGenerator = linkHorizontal()
      .x(node => node.y)
      .y(node => node.x);

    svg
      .selectAll(".node")
      .data(root.descendants())
      .join(enter => enter.append("circle").attr("opacity", 0))
      .attr("class", "node")
      .attr("cx", node => node.y)
      .attr("cy", node => node.x)
      .attr("r", 4)
      .transition()
      .duration(500)
      .delay(node => node.depth * 300)
      .attr("opacity", 1);

    // links
    const enteringAndUpdatingLinks = svg
      .selectAll(".link")
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
      .attr("opacity", 1);

    if (data !== previouslyRenderedData) {
      enteringAndUpdatingLinks
        .attr("stroke-dashoffset", function() {
          return this.getTotalLength();
        })
        .transition()
        .duration(500)
        .delay(link => link.source.depth * 500)
        .attr("stroke-dashoffset", 0);
    }

    //labels
    svg
      .selectAll(".label")
      .data(root.descendants())
      .join("text")
      .attr("class", "label")
      .text(
        node =>
          node.children
            ? node.data.name
            : node.data.partner_organization && node.data.partner_organization
        // : node.data.partner_organization && node.data.partner_organization
      )
      .attr("text-anchor", node => (node.children ? "middle" : "back"))
      .attr("font-size", node => (node.children ? 15 : 12))
      .attr("x", node => (node.children ? node.y : node.y + 5))
      .attr("y", node => (node.children ? node.x - 12 : node.x + 3));
  }, [data, partnerOrganization, dimensions, previouslyRenderedData]);
  return (
    <div className={styles.root2} ref={wrapperRef}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default memo(OrganizationTreeChart);
