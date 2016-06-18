import d3 from 'd3';

/*
 * Render a table with a row of th's for header values. Includes a title above the 
 * header values if one is provided.
 */
export default function table(data, holderID, headers = [], title) {
  const table = d3.select(holderID).append('table');
  const head = table.append('thead');

  if ( title !== undefined ) {
    head.append('tr').append('th')
      .text(title)
      .classed('title', true)
      .attr('colspan', headers.length || 1);
  }

  head.append('tr').selectAll('th')
      .data(headers)
    .enter().append('th')
      .text(d => d);

  table.append('tbody').selectAll('tr')
      .data(data)
    .enter().append('tr')
      .selectAll('td')
          .data(d => d)
        .enter().append('td')
          .html(d => d);
}
