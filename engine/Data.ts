import axios from "axios";
import chunk from "lodash/chunk";
export const fetchSatellites = new Promise((resolve) => {
  axios
    .get(
      "https://api.allorigins.win/raw?url=http://www.celestrak.com/NORAD/elements/active.txt"
      // "https://api.allorigins.win/raw?url=https://celestrak.com/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle"
      // ISS (ZARYA)
      // 1 25544U 98067A   22084.12316441  .00006730  00000+0  12782-3 0  9996
      // 2 25544  51.6446  32.9367 0004076 310.4490 170.3824 15.49536326332148
    )
    .then((res) => res?.data)
    .then((data) => {
      // [ "ISS (ZARYA)",
      //   "1 25544U 98067A   22084.12316441  .00006730  00000+0  12782-3 0  9996",
      //   "2 25544  51.6446  32.9367 0004076 310.4490 170.3824 15.49536326332148", ]
      const chunks = chunk(
        data.split("\n").map((l) => l.replace("\n", "")),
        3
      );
      return chunks.map((chunk) => ({
        name: chunk[0],
        tle1: chunk[1],
        tle2: chunk[2],
      }));
    })
    .then((satellites) => {
      // satellites.forEach(({ name, tle1, tle2 }) => {
      //   attemptStuff({ name, tle1, tle2 });
      // });
      resolve(satellites);
    });
});
