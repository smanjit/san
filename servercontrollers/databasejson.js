var nano = require('nano')('http://admin:admin123@localhost:5984'),
delegate = nano.db.use('omsdelegate');

module.exports.data = function(rawdata, lobject, callback) {
  //return callback(false);
  var arr = [];
  //console.log(lobject);
  if(!rawdata.total_rows) {
    return callback(false);
  }
  for(var i=0; i<rawdata.total_rows;i++) {
    arr.push(rawdata.rows[i].doc);
    if(i==rawdata.total_rows-1) {
      var specific = arr.filter(function(item) {
        return (
          item.title == lobject.title &&
          item.userid == lobject.userid &&
          item.type == lobject.type &&
          item.date == lobject.date
        );
      })
      return callback(specific.length?true:false);
    }
  }
}

module.exports.data1 = function(rawdata, lobject, callback) {
  //return callback(false);
  var arr = [];
  //console.log(lobject);
  if(!rawdata.total_rows) {
    return callback(false);
  }
  for(var i=0; i<rawdata.total_rows;i++) {
    arr.push(rawdata.rows[i].doc);
    if(i==rawdata.total_rows-1) {
      var specific = arr.filter(function(item) {
        return (
          item.type == lobject.type &&
          item.name == lobject.name
        );
      })
      return callback(specific.length?true:false);
    }
  }
}

module.exports.getteams = function(userid, callback){

    delegate.get(userid, function(err, myteams) {
    if(err) {
        return callback([]);
    }
    else {
      return callback(myteams.myteams);
    }
})

}
