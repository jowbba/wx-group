var app = getApp()
var Bmob = app.Bmob
var user = Bmob.User.current()

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function findWithId(name,id) {
  return new Promise((resolve, reject) => {
    var Query = Bmob.Object.extend(name)
    var query = new Bmob.Query(Query)
    query.get(id, {
      success: result => resolve(result),
      error: err => reject(err)
    })
  })
}

module.exports = {
  formatTime, findWithId
}
