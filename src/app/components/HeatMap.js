"use client";

import React, { useEffect, useRef } from "react";

const GoalProgressHeatmap = ({ goalData }) => {
  const svgRef = useRef();

  useEffect(() => {
    import("d3").then((d3) => {
      if (!goalData?.goal_progresses) return;

      const margin = { top: 20, right: 30, bottom: 50, left: 40 };

      const updateChart = () => {
        if (!svgRef.current) return; // Check if svgRef.current is not null

        const containerWidth = svgRef.current.parentElement.offsetWidth;
        const width = containerWidth - margin.left - margin.right;
        const height = 200;

        const numWeeks = Math.ceil(goalData.goal_progresses.length / 7);
        const cellSize = Math.min(
          width / numWeeks,
          (height - margin.top - margin.bottom) / 7
        );

        d3.select(svgRef.current).selectAll("*").remove();
        const svg = d3
          .select(svgRef.current)
          .attr("viewBox", `0 0 ${containerWidth} ${height}`)
          .attr("width", "100%")
          .attr("height", "100%")
          .append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Format dataset
        const dataset = goalData.goal_progresses.map((progress) => ({
          date: progress.date,
          week: d3.timeFormat("%U")(new Date(progress.date)),
          day: new Date(progress.date).getDay(),
          day_of_week: d3.timeFormat("%a")(new Date(progress.date)),
          month: d3.timeFormat("%b")(new Date(progress.date)),
          completed: progress.completed,
        }));

        const orderedDataset = dataset.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        // Adjust dataset to start from the 1st of the first month
        const fillMissingDates = (data) => {
          if (!data.length) return [];

          const firstDate = new Date(data[0].date);
          const lastDate = new Date(data[data.length - 1].date);
          const startMonth = new Date(
            firstDate.getFullYear(),
            firstDate.getMonth(),
            1
          );
          const endMonth = new Date(
            lastDate.getFullYear(),
            lastDate.getMonth() + 1,
            0
          );

          let currentDate = new Date(startMonth);
          const filledDataset = [];

          const formatDate = (date) =>
            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
              2,
              "0"
            )}-${String(date.getDate()).padStart(2, "0")}`;

          while (currentDate <= endMonth) {
            filledDataset.push({
              date: formatDate(currentDate),
              week: d3.timeFormat("%U")(currentDate),
              day: currentDate.getDay(),
              day_of_week: d3.timeFormat("%a")(currentDate),
              month: d3.timeFormat("%b")(currentDate),
              completed:
                data.find(
                  (d) =>
                    formatDate(new Date(d.date)) === formatDate(currentDate)
                )?.completed || false,
            });

            currentDate.setDate(currentDate.getDate() + 1);
          }

          // Ensure it starts on a Sunday (day 0)
          while (new Date(filledDataset[0].date).getDay() !== 0) {
            const prevDate = new Date(filledDataset[0].date);
            prevDate.setDate(prevDate.getDate() - 1);
            filledDataset.unshift({
              date: formatDate(prevDate),
              week: d3.timeFormat("%U")(prevDate),
              day: prevDate.getDay(),
              day_of_week: d3.timeFormat("%a")(prevDate),
              month: d3.timeFormat("%b")(prevDate),
              completed: false,
            });
          }

          // Ensure it ends on a Saturday (day 6)
          while (
            new Date(filledDataset[filledDataset.length - 1].date).getDay() !==
            6
          ) {
            const nextDate = new Date(
              filledDataset[filledDataset.length - 1].date
            );
            nextDate.setDate(nextDate.getDate() + 1);
            filledDataset.push({
              date: formatDate(nextDate),
              week: d3.timeFormat("%U")(nextDate),
              day: nextDate.getDay(),
              month: d3.timeFormat("%b")(nextDate),
              completed: false,
            });
          }

          return filledDataset;
        };

        const completeDataset = fillMissingDates(orderedDataset);

        const monthPositions = [];
        const seenMonths = new Set();
        const weekMap = new Map(); // Stores the latest entry for each week

        completeDataset.forEach((d) => {
          if (!seenMonths.has(d.month)) {
            seenMonths.add(d.month);

            // Check if a record with the same week already exists
            if (weekMap.has(d.week)) {
              // Overwrite with the latest month
              weekMap.set(d.week, { month: d.month, week: d.week });
            } else {
              // Otherwise, add a new record
              const entry = { month: d.month, week: d.week };
              weekMap.set(d.week, entry);
              monthPositions.push(entry);
            }
          }
        });

        // Convert map values to array, keeping only the latest entries
        const finalMonthPositions = Array.from(weekMap.values());

        // Define scales
        const xScale = d3
          .scaleBand()
          .domain(completeDataset.map((d) => d.week))
          .range([0, width])
          .padding(0.05);

        const yScale = d3
          .scaleBand()
          .domain([0, 1, 2, 3, 4, 5, 6])
          .range([0, height - margin.top - margin.bottom])
          .padding(0.05);

        const colorScale = d3
          .scaleOrdinal()
          .domain([true, false])
          .range(["#5525ff", "#ddd3ff"]);

        // Draw heatmap cells
        svg
          .selectAll("rect")
          .data(completeDataset)
          .enter()
          .append("rect")
          .attr("x", (d) => xScale(d.week))
          .attr("y", (d) => yScale(d.day))
          .attr("width", cellSize)
          .attr("height", cellSize)
          .attr("fill", (d) => colorScale(d.completed))
          .attr("stroke", "white")
          .attr("rx", 2)
          .attr("ry", 2);

        // X-Axis (Every Month Label)
        svg
          .append("g")
          .attr(
            "transform",
            `translate(0, ${height - margin.top - margin.bottom + 20})`
          )
          .selectAll("text")
          .data(finalMonthPositions)
          .enter()
          .append("text")
          .attr("x", (d) => xScale(d.week) + cellSize)
          .attr("y", 10)
          .attr("text-anchor", "middle")
          .attr("fill", "gray")
          .attr("font-size", "12px")
          .text((d) => d.month);

        // Y-Axis (Days of the Week)
        svg
          .append("g")
          .call(
            d3
              .axisLeft(yScale)
              .tickFormat(
                (d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d]
              )
          )
          .selectAll("text")
          .attr("fill", "gray");

        svg.selectAll(".domain").remove();

        svg.selectAll("line").attr("stroke", "lightgray");
      };

      updateChart();
      window.addEventListener("resize", updateChart);

      return () => {
        window.removeEventListener("resize", updateChart);
      };
    });
  }, [goalData]);

  return <svg ref={svgRef}></svg>;
};

export default GoalProgressHeatmap;
