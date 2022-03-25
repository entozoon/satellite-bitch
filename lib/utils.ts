export const between = (x, a, b) => x > a && x < b;
export const constrain = (x, a, b) => (x = x < a ? a : x > b ? b : x);
export const julianToMillis = (julian) => (julian - 2440587.5) * 86400000;
// https://gist.github.com/nicoptere/2f2571db4b454bb18cd9
export const randomColor = () =>
  `#${((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0")}`;
// Works but doesn't factor in height
export const latLngToXYZUnit = ({ latitude, longitude }) => {
  // flips the Y axis
  latitude = Math.PI / 2 - latitude;
  // distribute to sphere
  return {
    x: Math.sin(latitude) * Math.sin(longitude),
    y: Math.cos(latitude),
    z: Math.sin(latitude) * Math.cos(longitude),
  };
};
