"use client";

import React, { useEffect, useRef } from "react";
//import * as d3 from "d3";

const GoalProgressBarChart = ({ goalData }) => {
  const svgRef = useRef();

  useEffect(() => {
    import("d3").then((d3) => {
      if (!goalData?.goal_progresses) return;

      const width = 500,
        height = 200,
        margin = { top: 20, right: 20, bottom: 50, left: 50 };

      d3.select(svgRef.current).selectAll("*").remove();
      const svg = d3
        .select(svgRef.current)
        .attr("width", "100%")
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      // Get today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to avoid inconsistencies

      // Sort the dataset by date
      const orderedDataset = goalData.goal_progresses
        .map((progress, index) => ({
          x: index,
          date: new Date(progress.date),
          y: 0,
          value: goalData.duration_length,
          completed: progress.completed,
          day: new Date(progress.date).toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
          }),
        }))
        .sort((a, b) => a.date - b.date);

      // Determine the first available date
      const firstDate =
        orderedDataset.length > 0 ? orderedDataset[0].date : null;

      let filteredDataset = [];

      if (firstDate) {
        // Calculate the date 6 days before today
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6);

        // Check if at least 7 records exist before today
        const pastSevenDaysData = orderedDataset.filter(
          (d) => d.date >= sevenDaysAgo && d.date <= today
        );

        if (pastSevenDaysData.length === 7) {
          //  Case 1: There are exactly 7 records within the last 7 days
          filteredDataset = pastSevenDaysData;
        } else {
          //  Case 2: There are fewer than 7 records in the past 7 days
          const startIndex = orderedDataset.findIndex(
            (d) => d.date >= firstDate
          );
          filteredDataset = orderedDataset.slice(startIndex, startIndex + 7);
        }
      }

      // Define scales
      const xScale = d3
        .scaleBand()
        .domain(filteredDataset.map((d) => d.x))
        .range([0, width - margin.left - margin.right])
        .padding(0.05);

      const yScale = d3
        .scaleLinear()
        .domain([0, goalData.duration_length])
        .range([height - margin.top - margin.bottom, 0]);

      const colorScale = d3
        .scaleOrdinal()
        .domain([true, false])
        .range(["#5525ff", "#ddd3ff"]);

      // Draw heatmap cells (bars)
      svg
        .selectAll("rect")
        .data(filteredDataset)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(d.x))
        .attr("y", (d) => yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => yScale(0) - yScale(d.value))
        .attr("fill", (d) => colorScale(d.completed))
        .attr("stroke", "white");

      // X-Axis (Dates)
      svg
        .append("g")
        .attr(
          "transform",
          `translate(0, ${height - margin.top - margin.bottom})`
        )
        .call(
          d3.axisBottom(xScale).tickFormat((d, i) => filteredDataset[i].day)
        )
        .selectAll("line")
        .remove();

      svg.selectAll(".domain").remove();

      svg.selectAll(".tick text").attr("fill", "gray");

      // Y-Axis (30, 60 Labels)
      svg.append("g").call(
        d3
          .axisLeft(yScale)
          .tickValues([goalData.duration_length / 2, goalData.duration_length])
          .tickFormat((d) => d)
      );

      svg.selectAll(".domain").remove();

      svg.selectAll(".tick text").attr("fill", "gray");

      svg.selectAll("line").attr("stroke", "lightgray");
    });
  }, [goalData]);

  return <svg ref={svgRef}></svg>;
};

export default GoalProgressBarChart;
