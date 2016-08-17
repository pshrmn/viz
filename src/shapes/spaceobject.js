import patternMaker from 'textures/pattern';

export default function SpaceObject(name, radius, distance, type, renderer, texture, transform) {
  this.name = name;
  this.radius = radius;
  this.distanceFromSun = distance;
  this.type = type;
  this.renderer = renderer;
  // the url of the image of the object's texture
  this.texture = texture;
  // any special transformations that should be done to the object's g element
  this.transform = transform;

  this.scale = 1;
  this.rotating = false;
}

SpaceObject.prototype.render = function(planetHolder, patternHolder) {
  this.pattern = patternMaker(patternHolder, this.texture, this.name);
  this.g = this.renderer(planetHolder);
  this.g.attr('transform', `${this.transform}scale(${this.scale})`);

}

SpaceObject.prototype.rescale = function(newScale, smooth) {
  this.scale = newScale;
  if ( this.g === undefined ) {
    return;
  }
  this.retransform();
}

SpaceObject.prototype.retransform = function(smooth) {
  if ( smooth ) {
    this.g.transition()
      .duration(smooth)
      .ease(easeLinear)
      .attr('transform', `${this.transform}scale(${this.scale})`)
  } else {
    this.g.attr('transform', `${this.transform}scale(${this.scale})`)
  }
}

SpaceObject.prototype.radScale = function(full, smooth) {
  this.scale = this.radius / full;
  if ( this.g === undefined ) {
    return;
  }
  this.retransform();
}

SpaceObject.prototype.toggleRotate = function(on) {
  this.rotating = on !== undefined ? !!on : !this.rotating;
  if ( this.rotating ) {
    this.pattern.start();
  } else {
    this.pattern.stop();
  }
}