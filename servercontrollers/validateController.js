var bluepages = require('bluepages');

module.exports.validate = function(req, res) {
  console.log(req.body);

  // return res.send({"success": true});
  bluepages.checkIfUserExists(req.body.userid, function(err, result) {
    if(err)
    res.send({"success": false,message:"INVALID USER"});

    else {
      res.send({"success": result});
    }
  })
}
