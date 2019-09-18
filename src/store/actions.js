function deleteRow(startTime) {
  for (let i = 0; i < this.shifts.length; i++) {
    if (this.shifts[i].start === startTime) {
      this.shifts.splice(i, 1)
      break
    }
  }
}