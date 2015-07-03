/*
 * Draw a rudimentary human figure using circle and rects.
 * The base size is 29 pixels tall and 14 pixels wide
 */
function drawHuman(holder, pos, scale) {
    var human = holder.append('g')
        .classed({
            'human': true
        })
        .attr('transform', 'translate(' + pos[0] + ',' + pos[1] + ')scale(' + scale + ')');
    var head = human.append('circle')
        .attr('r', 5)
        .attr('cy', 5);
    var body = human.append('rect')
        .attr('x', -4)
        .attr('width', 8)
        .attr('y', 9)
        .attr('height', 20);

    var leftArm = human.append('rect')
        .attr('x', -7)
        .attr('width', 3)
        .attr('y', 9)
        .attr('height', 11);

    var rightArm = human.append('rect')
        .attr('x', 4)
        .attr('width', 3)
        .attr('y', 9)
        .attr('height', 11);
}

var width = 600;
var height = 400;
var svg = d3.select('.content svg')
    .attr('width', width)
    .attr('height', height);

var scale = 1;

function fillSVGWithHumans(scale) {
    var humanWidth = 14 * scale;
    var humanHeight = 29 * scale;
    var padding = 2*scale;
    var colCount = Math.floor(width / (humanWidth + 2*padding));
    var rowCount = Math.floor(height / (humanHeight + 2*padding));
    for ( var row = 0; row < rowCount; row++ ) {
        // double padding for previous rows, top padding for current row
        var rowPos = (2*row*padding) + padding + (row*humanHeight);
        for ( var col = 0; col < colCount; col++ ) {
            // double padding for previous column, left padding for current column
            // offset for previous column, and slize over half a human so the first column
            // isn't cut off
            var colPos = (2*col*padding) + padding + (col*humanWidth) + (humanWidth/2);
            drawHuman(svg, [colPos, rowPos], scale);
        }
    }

}

fillSVGWithHumans(scale);
