import patternMaker from 'textures/pattern';

export default function SpaceObject(name, radius, distance, type, renderer, texture, tilt) {
  this.name = name;
  this.radius = radius;
  this.distanceFromSun = distance;
  this.type = type;
  this.renderer = renderer;
  // the url of the image of the object's texture
  this.texture = texture;

  this.scale = 1;
  this.rotating = false;
  this.tilt = tilt || 0;
}

SpaceObject.prototype.render = function(planetHolder, patternHolder) {
  this.pattern = patternMaker(patternHolder, this.texture, this.name);
  // this g element is used for positioning the space object
  this.center = planetHolder.append('g')
    .classed('planet-center', true);
  this.transformer = this.center.append('g')
    .attr('transform', `scale(${this.scale})rotate(${this.tilt})`)
  this.planet = this.renderer(this.transformer);
}

SpaceObject.prototype.rescale = function(newScale, smooth) {
  this.scale = newScale;
  if ( this.g === undefined ) {
    return;
  }
  this.retransform(smooth);
}

/*
 * scale the object based on the ratio of the object's radius
 * to the full radius provided
 */
SpaceObject.prototype.radScale = function(full, smooth) {
  this.scale = this.radius / full;
  if ( this.g === undefined ) {
    return;
  }
  this.retransform(smooth);
}

/*
 * scale the object based on the object's radius and how many
 * kms fit in a pixel
 */
SpaceObject.prototype.kmScale = function(km, radius, smooth) {
  const pixels = km * this.radius;
  // 
  this.scale = Math.max(pixels / radius, 0.05);
  //this.scale = this.radius / full;
  if ( this.g === undefined ) {
    return;
  }
  this.retransform(smooth);
}


SpaceObject.prototype.retransform = function(smooth) {
  if ( smooth ) {
    this.transformer.transition()
      .duration(smooth)
      .ease(easeLinear)
      .attr('transform', `scale(${this.scale})rotate(${this.tilt})`);
  } else {
    this.transformer.attr('transform', `scale(${this.scale})rotate(${this.tilt})`)
  }
}

SpaceObject.prototype.toggleRotate = function(on) {
  this.rotating = on !== undefined ? !!on : !this.rotating;
  if ( this.rotating ) {
    this.pattern.start();
  } else {
    this.pattern.stop();
  }
}