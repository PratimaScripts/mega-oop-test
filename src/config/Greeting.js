const getGreetingTime = m => {
  var g = null; //return g

  if (!m || !m.isValid()) {
    return;
  } //if we can't find a valid or filled day, we return.

  var split_afternoon = 12; //24hr time to split the afternoon
  var split_evening = 16; //24hr time to split the evening
  var currentHour = parseFloat(m.format("HH"));

  if (currentHour >= split_afternoon && currentHour <= split_evening) {
    g = "afternoon";
  } else if (currentHour >= split_evening) {
    g = "evening";
  } else {
    g = "morning";
  }

  return g;
};

export default getGreetingTime;
