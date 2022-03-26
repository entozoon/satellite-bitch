import * as THREE from "three";
export const labelObject = ({ name, color, font }) => {
  const matLite = new THREE.MeshBasicMaterial({
    color,
    side: THREE.FrontSide,
  });
  const shapes = font.generateShapes(name, 100);
  const geometry = new THREE.ShapeGeometry(shapes);
  geometry.computeBoundingBox();
  geometry.translate(0, -geometry.boundingBox.max.y * 1.1, 0);
  const object = new THREE.Mesh(geometry, matLite);
  object.scale.set(0.2, 0.2, 1);
  object.visible = false;
  return object;
};
