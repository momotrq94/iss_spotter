// index.js
const {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation,
} = require("./iss");

const printPassTimes = function (passTimes) {
  for (const pass of passTimes) {
    const d = new Date(0);

    d.setUTCSeconds(pass.risetime);

    console.log(`Next pass at ${d} for ${pass.duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  printPassTimes(passTimes);
});
