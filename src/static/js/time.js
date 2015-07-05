/*
 * draw a humanesque block figure
 */
function stickFigure(){
    var headSize = 5;
    var armWidth = 3;
    var armLength = 11;
    var bodyWidth = 8;
    var bodyLength = 20;

    function draw(holder, pos){
        var halfBody = 0.5 * bodyWidth;
        var headOffset = 2 * headSize;
        var human = holder.append('g')
            .classed({
                'human': true
            })
            .attr('transform', 'translate(' + pos[0] + ',' + pos[1] + ')');
        var head = human.append('circle')
            .attr('r', headSize)
            .attr('cy', headSize);
        var body = human.append('rect')
            .attr('x', -1 * halfBody)
            .attr('width', bodyWidth)
            .attr('y', headOffset)
            .attr('height', bodyLength);

        var leftArm = human.append('rect')
            .attr('x', -1 * (halfBody + armWidth ))
            .attr('width', armWidth)
            .attr('y', headOffset)
            .attr('height', 11);

        var rightArm = human.append('rect')
            .attr('x', halfBody)
            .attr('width', armWidth)
            .attr('y', headOffset)
            .attr('height',armLength);

        return human;
    }

    // width and height use Math.max for abnormally sized stickFigures
    draw.width = function(){
        return Math.max(bodyWidth + 2 * armWidth, 2*headSize);
    };

    draw.height = function(){
        return 2*headSize + Math.max(bodyLength, armLength);;
    };

    draw.headSize = function(x){
        if ( !arguments.length ) {
            return headSize;
        }
        headSize = x;
        return draw;
    };

    draw.armWidth = function(x){
        if ( !arguments.length ) {
            return armWidth;
        }
        armWidth = x;
        return draw;
    };

    draw.armLength = function(x){
        if ( !arguments.length ) {
            return armLength;
        }
        armLength = x;
        return draw;
    };

    draw.bodyWidth = function(x){
        if ( !arguments.length ) {
            return bodyWidth;
        }
        bodyWidth = x;
        return draw;
    };

    draw.bodyLength = function(x){
        if ( !arguments.length ) {
            return bodyLength;
        }
        bodyLength = x;
        return draw;
    };

    return draw;
}

var width = 600;
var height = 400;
var svg = d3.select('.content svg')
    .attr('width', width)
    .attr('height', height);
var drawAHuman = stickFigure()
    .headSize(10);

/*
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

// fillSVGWithHumans(scale);
*/

function expandableHuman(x, y) {
    var padding = 2;
    var human = drawAHuman(svg, [x,y]);
    var humanWidth = drawAHuman.width();
    human.on('click', function(){
        svg.selectAll('g.clone').remove();
        var clones = d3.range(Math.floor(Math.random()*10)).map(function(d){
            var pos = d+1;
            var newX = x + pos * (padding + humanWidth);
            var clone = drawAHuman(svg, [x, y]);
            clone
                .classed('clone', true)
                .datum([newX, y]);
        })
        
        svg.selectAll('g.clone').transition()
            .duration(250)
            .ease('linear')
            .attr('transform', function(d){
                return 'translate(' + d[0] + ',' + d[1] + ')';
            });

    });
}

var clonable = expandableHuman(25, 25);
