export const between = (x, a, b) => x > a && x < b;
export const constrain = (x, a, b) => (x = x < a ? a : x > b ? b : x);
export const julianToMillis = (julian) => (julian - 2440587.5) * 86400000;
// https://gist.github.com/nicoptere/2f2571db4b454bb18cd9
export const latLngToXYZUnit = ({ lat, lng }) => {
  // flips the Y axis
  lat = Math.PI / 2 - lat;
  // distribute to sphere
  return {
    x: Math.sin(lat) * Math.sin(lng),
    y: Math.cos(lat),
    z: Math.sin(lat) * Math.cos(lng),
  };
};
