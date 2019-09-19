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
  constructor(shifts) {
    this.shifts = shifts || []
  }

  getShiftById(id) {
    for (let i = 0; i < this.shifts.length; i++) {
      if (this.shifts[i].id === id) {
        return i
      }
    }
  }

  addShift(shift) {
    console.log('addShift', shift)
    this.shifts.push(shift)
  }

  deleteRow(id) {
    const index = this.getShiftById(id)
    this.shifts.splice(index, 1)
  }

  updateCell(id, field, value) {
    const index = this.getShiftById(id)
    this.shifts[index][field] = value
  }
}

export { ShiftsModel }