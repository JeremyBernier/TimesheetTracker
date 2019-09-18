/*const ShiftModel = {
  id: Number,
  start: Number,
  stop: Number,
  notes: String,
}

const store = {
  shifts: []
}*/

class ShiftsModel {
  constructor() {
    this.shifts = []
  }

  getShiftById(startTime) {
    for (let i = 0; i < this.shifts.length; i++) {
      if (this.shifts[i].start === startTime) {
        return i
      }
    }
  }

  deleteRow(startTime) {
    const index = this.getShiftById(startTime)
    this.shifts.splice(index, 1)
  }

  updateCell(startTime, field, value) {
    const index = this.getShiftById(startTime)
    this.shifts[index][field] = value
  }
}

export { ShiftsModel }