const HOURLY_RATE = 50

export function calculateTotalTime(shifts) {
  const sum = shifts.map((shift) => {
    return (shift.stop - shift.start)
  }).reduce((a, b) => a + b, 0)

  return sum
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

export function displayDate(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

export function displayTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return hours + ':' + minutes + ' ' + ampm;
}