const request = require("request");

const fetchMyIP = function (callback) {
  // use request to fetch IP address from JSON API
  request("https://api.ipify.org?format=json", (error, response, body) => {
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    let data = JSON.parse(body);
    callback(error, data.ip);
  });
};

const fetchCoordsByIP = function (ipString, callback) {
  request(`https://freegeoip.app/json/${ipString}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    let data1 = JSON.parse(body);
    let outputObj = {
      latitude: data1.latitude,
      longitude: data1.longitude,
    };
    callback(error, outputObj);
  });
};

const fetchISSFlyOverTimes = function (coords, callback) {
  request(
    `https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`,
    (error, response, body) => {
      if (error) {
        callback(error, null);
        return;
      }
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
        callback(Error(msg), null);
        return;
      }
      let data2 = JSON.parse(body);
      let outputArray = data2.response;

      callback(error, outputArray);
    }
  );
};

const nextISSTimesForMyLocation = function (callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      console.log(`We hit an error: ${error}`);
      return;
    }
    let ip4 = ip;
    fetchCoordsByIP(ip4, (error, data) => {
      if (error) {
        console.log(`We hit an error: ${error}`);
        return;
      }
      let posObj = data;
      fetchISSFlyOverTimes(posObj, (error, passes) => {
        if (error) {
          console.log(`We hit an error: ${error}`);
          return;
        }
        callback(null, passes);
      });
    });
  });
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation,
};
