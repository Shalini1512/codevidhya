module.exports.logQuery = function(startHrTime, tag) {
  var endTime = process.hrtime(startHrTime);
  console.log(
    `${tag}: Query took ${endTime[0]}s ${Math.round(endTime[1] / 1000000)}ms`
  );
};

module.exports.logQueryIfSlow = function(startHrTime, tag) {
  var slowTimeLimitMillis = 500;
  var endTime = process.hrtime(startHrTime);
  if (
    endTime[0] > 1 ||
    (endTime[0] < 1 && endTime[1] > slowTimeLimitMillis * 1000000)
  ) {
    // Log if time greater than slowTimeLimitMillis
    console.log(
      `${tag}: Query took ${endTime[0]}s ${Math.round(endTime[1] / 1000000)}ms`
    );
  }
};
