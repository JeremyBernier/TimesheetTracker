const HOURLY_RATE = 50

export function UTCISOStringToTime(s) {
  return UTCISOStringToDate(s).getTime()
}

// https://stackoverflow.com/questions/10678610/utc-times-in-javascript
export function UTCISOStringToDate(s) {
  var b = s.split(/[-T:\.Z]/i);
  return new Date(Date.UTC(b[0],b[1]-1,b[2],b[3],b[4],b[5]));
}

export function UTCToLocal(d) {
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); 
  return d;
}

export function LocalToUTC(d) {
  d.setMinutes(d.getMinutes() + d.getTimezoneOffset()); 
  return d;
}

export function LocalToUTCStr(dateStr) {
  return LocalToUTC(UTCISOStringToDate(dateStr)).toISOString()
}

export function calculateTotalTime(shifts) {
  const sum = shifts.map((shift) => {
    return getTimeDiff(shift.start, shift.stop)
  }).reduce((a, b) => a + b, 0)

  return sum
}

export function getTimeDiff(start, stop) {
  const stopMs = UTCISOStringToTime(stop)
  const startMs = UTCISOStringToTime(start)
  return stopMs - startMs
}

export function timeToEarnings(time) {
  const sum = time * HOURLY_RATE / 3600000
  return Math.round(sum * 100) / 100
}

export function displayTimeDuration(msTimeDiff) {
  const totalSeconds = Math.floor(msTimeDiff / 1000)

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${hours}:${minutes}:${seconds}`
}

export function displayEarnings(earnings) {
  return `$${earnings}`
}

function getHours(dateStr) {
  return dateStr.substring(11,13)
}

// @param {String} date  UTCISO string
export function displayDate(dateStr) {
  const dateObj = UTCISOStringToDate(dateStr)
  const localDateObj = UTCToLocal(dateObj)
  return localDateObj.toISOString().substring(0,10)
}

export function displayTime(dateStr) {
  const dateObj = UTCISOStringToDate(dateStr)
  const localDateObj = UTCToLocal(dateObj)
  return localDateObj.toISOString().substring(11,16)
}

/*export function displayTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return hours + ':' + minutes + ' ' + ampm;
}*/