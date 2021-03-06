// This is required for d3 to load.
/* global d3 */

const InternalBar = {
  // Builds the actual chart components with data, including the tooltips
  /*
  @private
  @function buildChartComponents
  @description Builds the actual chart components with data, including the tooltips
  @returns {Object} context (chart instance)
   */

  buildChartComponents(context) {
    // Uses d3 to build the chart components for bar chart
    // using the chart data. Sets event listeners mouseover
    // and mouseout to hide/show tooltips. Uses transition
    // to transition the bars into view.

    const tooltip = context.tooltip;

    context.svg.selectAll('.bar')
         .data(context.data)
         .enter()
         .append('rect')
         .attr('class', 'bar')
         .on('mouseover', (d) => { // Set up tooltips
           tooltip.show();
           tooltip.setContent(`<strong>${context.yColumnName}:</strong> ${d[context.yColumnName]}</br>
             <strong>${context.xColumnName}:</strong> ${d[context.xColumnName]}`);

           d3.select(d3.event.target)
              .style('fill', context.getColors[1]);
         })
          .on('mouseout', () => {
            tooltip.hide();
            d3.select(d3.event.target)
              .style('fill', context.getColors[0]);
          })

         .attr('x', d => { return context.xScale(d[context.getxAxisLabel]); }) // start position before transition
         .attr('y', context.getChartHeight)
         .attr('width', context.xScale.rangeBand())
         .attr('height', 0)
         .style('fill', context.getColors[0])
         .transition() // transiiton to ending position of rects
         .duration(300)
         .delay((d, i) => { return i * 50; })
         .attr('y', d => { return context.yScale(d[context.getyAxisLabel]); })
         .attr('height', d => { return context.getChartHeight - context.yScale(d[context.getyAxisLabel]); });

    return context;
  },

  // Updates and recreates the bars on chart
  /*
  @private
  @function updateChartComponents
  @description Updates and recreates the bars on chart
  @param {Object} context (chart instance)
  @returns {Object} context (chart instance)
  */

  updateChartComponents(context) {
    context.svg.selectAll('.bar')
             .data(context.data)
             .transition()
             .attr('class', 'bar')
             .attr('x', d => { return context.xScale(d[context.getxAxisLabel]); })
             .attr('width', context.xScale.rangeBand())
             .attr('y', d => { return context.yScale(d[context.getyAxisLabel]); })
             .attr('height', d => { return context.getChartHeight - context.yScale(d[context.getyAxisLabel]); })
             .style('fill', context.getColors[0]);

    return context;
  },

  // Updates the chart's style on the element
  /*
  @private
  @function styleChart
  @description Updates the chart's style on the element
  @param {Object} context (chart instance)
  @returns {Object} context (chart instance)
  */

  styleChart(context) {
    // Styles the chart's font-size, font-style, and title
    context.element.select('svg')
        .style('font-family', context.getFontStyle)
        .attr('font-size', context.getFontSize)
        .append('text')
        .attr('class', 'title')
        .attr('x', context.getChartWidth * 0.5)
        .attr('y', 20)
        .text(context.getTitle);


    return context;
  },

  // Updates color of bar chart after initial render
  /*
  @private
  @function updateColors
  @description Updates color of bar chart after initial render
  @param {Object} context (chart instance)
  @returns {Object} context (chart instance)
  */

  updateColors(context) {
    context.element.select('svg').selectAll('rect')
           .remove();

    this.buildChartComponents(context);

    return context;
  },


};

export default InternalBar;
