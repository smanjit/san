var nano = require('nano')('http://admin:admin123@localhost:5984'),
functionalteam = nano.db.use('omsfunctionalteam'),
forms = nano.db.use('omsforms'),
names = nano.db.use('omsnames'),
delegate = nano.db.use('omsdelegate'),
json2xls = require('json2xls'),
url = require('url'),
path = require('path'),
fs=require('fs');

var bluepages = require('bluepages');
var databasejson = require('./databasejson');
var nodemailer = require('nodemailer');
var mail_config = {
       host:"d23hubm6.in.ibm.com",
       port:25,
           tls: {rejectUnauthorized: false}
    };
var transporter = nodemailer.createTransport(mail_config);

//export lead data
module.exports.lead_export = function(req,res){
    var url_parts = url.parse(req.url, true);
    var user = url_parts.query.userid;
    console.log("here " + user);
databasejson.getteams(user, function(team) {
    forms.list({include_docs: true}, function(err, result) {
      var arr = []

      if((result.total_rows)==0) {
        xls = json2xls(arr);
        fs.writeFile(path.resolve(__dirname + '/../public/exportfile.xlsx'), xls, 'binary', function(err) {
          if (err) throw err;
          console.log('file saved');
          res.end();
        });
      }
      for(var i=0;i<result.total_rows;i++) {

        test = result.rows[i].doc;
        test["USER ID"] =test.userid;
        test["USER NAME"] = test.username;
        test["TITLE"] = test.title;
        test["DATE OF ACCOMPLISHMENT"] = test.date;
        test["ACCOMPLISHMENT TYPE"] = test.type;
        test["TYPE NAME"] = test.name;
//        test["POINTS"] = test.point;
        test["FUNCTIONAL TEAM"] = test.fteam;
        test["DESCRIPTION"] = test.description;
        if(team.indexOf(result.rows[i].doc.fteam) != -1)
            arr.push(test);


        if(i==(result.total_rows-1)) {
          //var fields = ['USER NAME', 'TITLE', 'DATE OF ACCOMPLISHMENT', 'ACCOMPLISHMENT TYPE','TYPE NAME', 'POINTS', 'FUNCTIONAL TEAM', 'DESCRIPTION'];
          var fields = ['USER NAME', 'TITLE', 'DATE OF ACCOMPLISHMENT', 'ACCOMPLISHMENT TYPE','TYPE NAME', 'FUNCTIONAL TEAM', 'DESCRIPTION'];
          if(arr[0])
          var xls = json2xls(arr, {"fields": fields});
          else
          var xls = json2xls({}, {});
          fs.writeFile(path.resolve(__dirname + '/../public/exportfile.xlsx'), xls, 'binary', function(err) {
            if (err) throw err;
            console.log('file saved');
            res.end();
          });
        }

    }
    });
});
}

//export admin data
module.exports.admin_export = function(req,res){

    forms.list({include_docs: true}, function(err, result) {
      var arr = []

      if((result.total_rows)==0) {
        xls = json2xls(arr);
        fs.writeFile(path.resolve(__dirname + '/../public/exportfile.xlsx'), xls, 'binary', function(err) {
          if (err) throw err;
          console.log('file saved');
          res.end();
        });
      }
      for(var i=0;i<result.total_rows;i++) {

        test = result.rows[i].doc;
        test["USER ID"] =test.userid;
        test["USER NAME"] = test.username;
        test["TITLE"] = test.title;
        test["DATE OF ACCOMPLISHMENT"] = test.date;
        test["ACCOMPLISHMENT TYPE"] = test.type;
        test["TYPE NAME"] = test.name;
        test["POINTS"] = test.point;
        test["FUNCTIONAL TEAM"] = test.fteam;
        test["DESCRIPTION"] = test.description;
        arr.push(test);
        if(i==(result.total_rows-1)) {
          var fields = ['USER NAME', 'TITLE', 'DATE OF ACCOMPLISHMENT', 'ACCOMPLISHMENT TYPE','TYPE NAME', 'POINTS', 'FUNCTIONAL TEAM', 'DESCRIPTION'];
          if(arr[0])
          var xls = json2xls(arr, {"fields": fields});
          else
          var xls = json2xls({}, {});
          fs.writeFile(path.resolve(__dirname + '/../public/exportfile.xlsx'), xls, 'binary', function(err) {
            if (err) throw err;
            console.log('file saved');
            res.end();
          });
        }
    }
    });
}

//export user data
module.exports.user_export = function(req,res){
  var url_parts = url.parse(req.url, true);
  var user = url_parts.query.userid;
  console.log("here " + user);
    forms.list({include_docs: true}, function(err, result) {
      var arr = []

      if((result.total_rows)==0) {
        xls = json2xls(arr);
        fs.writeFile(path.resolve(__dirname + '/../public/exportfile.xlsx'), xls, 'binary', function(err) {
          if (err) throw err;
          console.log('file saved');
          res.end();
        });
      }
      for(var i=0;i<result.total_rows;i++) {

        test = result.rows[i].doc;
        test["USER ID"] =test.userid;
        test["USER NAME"] = test.username;
        test["TITLE"] = test.title;
        test["DATE OF ACCOMPLISHMENT"] = test.date;
        test["ACCOMPLISHMENT TYPE"] = test.type;
        test["TYPE NAME"] = test.name;
      //  test["POINTS"] = test.point;
        test["FUNCTIONAL TEAM"] = test.fteam;
        test["DESCRIPTION"] = test.description;
        if(test["USER ID"]==user)
            arr.push(test);

        if(i==(result.total_rows-1)) {
          //var fields = ['USER NAME', 'TITLE', 'DATE OF ACCOMPLISHMENT', 'ACCOMPLISHMENT TYPE','TYPE NAME', 'POINTS', 'FUNCTIONAL TEAM', 'DESCRIPTION'];
          var fields = ['USER NAME', 'TITLE', 'DATE OF ACCOMPLISHMENT', 'ACCOMPLISHMENT TYPE','TYPE NAME', 'FUNCTIONAL TEAM', 'DESCRIPTION'];
          if(arr[0])
          var xls = json2xls(arr, {"fields": fields});
          else
          var xls = json2xls({}, {});
          fs.writeFile(path.resolve(__dirname + '/../public/exportfile.xlsx'), xls, 'binary', function(err) {
            if (err) throw err;
            console.log('file saved');
            res.end();
          });
        }
    }
    });
}


//lead top Performer
module.exports.leadtopperformer = function(req,res){
  var startdate = req.body.startdate;
  var enddate = req.body.enddate;
  var userid = req.body.userid;
  var final ={};
  var arr = [];
  var repo = [];
  var allforms;

function userExists(username) {
  return repo.some(function(el) {
    return el.username === username;
  });
}

function updatepoints(username,point) {
return repo.some(function(el) {
  // console.log("el"+ el);
  if(el.username === username)
  {
  el.point = parseInt(el.point) + parseInt(point);
  return;
  }
});
}
databasejson.getteams(userid, function(team) {
  forms.list({include_docs:true}, function(err, result) {
          for(var i=0;i<result.total_rows;i++) {
            if(result.rows[i].doc.date <= enddate && result.rows[i].doc.date >= startdate && team.indexOf(result.rows[i].doc.fteam) != -1)
              {
                arr.push(result.rows[i].doc);
                console.log((result.rows[i].doc.fteam) + "\n");
              }
          }
          for(var i=0;i<arr.length;i++)
          {
            if(userExists(arr[i].username))
              {
                //updatepoints(arr[i].username , arr[i].point);
                                updatepoints(arr[i].username , arr[i].point, arr[i].type);

              }
              else {
                                var type = arr[i].type;
                                var blog=0,badges=0,enablement=0,ur=0,asset=0,certifications=0,rfe=0,dw_article=0,patent=0,forum=0,giveback=0;
                                if (type=="blog")
                                        blog=arr[i].point;
                                else if(type=="badges")
                                        badges=arr[i].point;
                                else if(type=="enablement")
                                        enablement=arr[i].point;
                                else if(type=="ur")
                                        ur=arr[i].point;
                                else if(type=="asset")
                                        asset=arr[i].point;
                                else if(type=="certifications")
                                        certifications=arr[i].point;
                                else if(type=="rfe")
                                        rfe=arr[i].point;
                                else if(type=="dw_article")
                                        dw_article=arr[i].point;
                                else if(type=="giveback")
                                        giveback=arr[i].point;
                                else if(type=="patent")
                                        patent=arr[i].point;
                                else if(type=="forum")
                                        forum=arr[i].point;
                repo.push({username:arr[i].username,point:arr[i].point,blog:blog,badges:badges,enablement:enablement,ur:ur,asset:asset,certifications:certifications,rfe:rfe,external_article:dw_article,giveback:giveback,patent:patent,forum:forum});
                //repo.push({username:arr[i].username,point:arr[i].point});
              }
          }
          repo.sort(function(a,b){
            return b.point - a.point;
          });
        if(repo.length){ console.log(repo);
          return res.send({success:true,data:repo});
                }
        else
          return res.send({success:false,message:"NO ACCOMPLISHMENTS BETWEEN THE SPECIFIED DATES" });
        })
      })
}
  
//top Performer
module.exports.topperformer = function(req,res){
  var startdate = req.body.startdate;
  var enddate = req.body.enddate;
  var final ={};
  var arr = [];
  var repo = [];

function userExists(username) {
  return repo.some(function(el) {
    return el.username === username;
  });
}

function updatepoints(username,point,type) {
return repo.some(function(el) {
  // console.log("el"+ el);
  if(el.username === username)
  {
  el.point = parseInt(el.point) + parseInt(point);
  el[type] = parseInt(el[type]) + parseInt(point) ;
  return;
  }
});
}

  forms.list({include_docs:true}, function(err, result) {
          for(var i=0;i<result.total_rows;i++) {
            if(result.rows[i].doc.date <= enddate && result.rows[i].doc.date >= startdate)
              {
                arr.push(result.rows[i].doc);
              }
          }
          for(var i=0;i<arr.length;i++)

         {
            if(userExists(arr[i].username))
              { //console.log(arr[i].type);
                                //if(arr[i].type=="badges")
                updatepoints(arr[i].username , arr[i].point, arr[i].type);
              }
              else {
                                  //if(arr[i].type=="badges")
                //repo.push({username:arr[i].username,point:arr[i].point});
                                var type = arr[i].type;
                                var blog=0,badges=0,enablement=0,ur=0,asset=0,certifications=0,rfe=0,dw_article=0,patent=0,forum=0,giveback=0;
                                if (type=="blog")
                                        blog=arr[i].point;
                                else if(type=="badges")
                                        badges=arr[i].point;
                                else if(type=="enablement")
                                        enablement=arr[i].point;
                                else if(type=="ur")
                                        ur=arr[i].point;
                                else if(type=="asset")
                                        asset=arr[i].point;
                                else if(type=="certifications")
                                        certifications=arr[i].point;
                                else if(type=="rfe")
                                        rfe=arr[i].point;
                                else if(type=="dw_article")
                                        dw_article=arr[i].point;
                                else if(type=="giveback")
                                        giveback=arr[i].point;
                                else if(type=="patent")
                                        patent=arr[i].point;
                                else if(type=="forum")
                                        forum=arr[i].point;
                repo.push({username:arr[i].username,point:arr[i].point,blog:blog,badges:badges,enablement:enablement,ur:ur,asset:asset,certifications:certifications,rfe:rfe,external_article:dw_article,giveback:giveback,patent:patent,forum:forum});
                                //repo.push({username:arr[i].username,point:arr[i].point,[type]:arr[i].point});
                          }
          }
           console.log(repo);
          repo.sort(function(a,b){
            return b.point - a.point;
          });
        if(repo.length)// console.log(repo);
          return res.send({success:true,data:repo});
        else
          return res.send({success:false,message:"NO ACCOMPLISHMENTS BETWEEN THE SPECIFIED DATES" });

        })
}


//adminfeed
module.exports.adminfeed = function(req, res, callback) {
  var url_parts = url.parse(req.url, true);
  var user = url_parts.query.userid;
  forms.list({include_docs:true}, function(err, result) {
          var arr = []
          if(!result.total_rows)
          return callback(arr, user);
          for(var i=0;i<result.total_rows;i++) {
              arr.push(result.rows[i].doc);
              if(i==result.total_rows-1) {
                return callback(arr, user);
              }
          }
        })
    }

//userfeed
module.exports.userfeed = function(req, res, callback) {
  var url_parts = url.parse(req.url, true);
  var user = url_parts.query.userid;
  forms.list({include_docs:true}, function(err, result) {
          var arr = []
          if(!result.total_rows)
          return callback(arr, user);
          for(var i=0;i<result.total_rows;i++) {
              arr.push(result.rows[i].doc);
              if(i==result.total_rows-1) {
                return callback(arr, user);
              }
          }
        })
    }

//lead feed
module.exports.leadfeed = function(req, res, callback) {
  var url_parts = url.parse(req.url, true);
  var user = url_parts.query.userid;
  databasejson.getteams(user, function(team) {

      forms.list({include_docs:true}, function(err, result) {
              var arr = []
              if(!result.total_rows)
              return callback(arr, user ,team);
              for(var i=0;i<result.total_rows;i++) {
                  arr.push(result.rows[i].doc);
                  if(i==result.total_rows-1) {
                    return callback(arr, user , team);
                  }
              }
            })
          })
  }

//delagates
module.exports.delegate = function(req, res) {
  delegate.insert(req.body, function(err, result) {
    if(err) {
      return res.send({success:false,"message":"USER ALREADY DELEGATED (tip: delete and try to delegate again)"});
    }
    delegate.get(result.id, function(err, body) {
      if(err) {
        return res.send({success:false,"message":"FAILED"})
      }
      else {
        return res.send({success:true,"message":"SUCCESSFULLY DELEGATED"});
      }
    })
  })
}

// delete delegate
module.exports.deletedelegate = function(req, res) {
  delegate.destroy(req.body._id, req.body._rev, function(err, result) {
    if(err) {
      console.log("failed to delete");
      return res.send({"success":false,"message":"DELETED SUCCESSFULLY"});
    }
    else {
      return res.send({"success":true,"message":"DELETED SUCCESSFULLY"})
    }
  })
}

//get delegations
module.exports.getdelegates = function(req, res) {

  var arr = []
  delegate.list({include_docs: true}, function(err, result) {
    if(!result.total_rows)
    return res.send(arr);
    for(var i=0;i<result.total_rows;i++) {
      arr.push(result.rows[i].doc);
      if(i==result.total_rows-1) {
        res.send(arr);
      }
    }
  })
}

//adding new functional team
module.exports.addfteam = function(req, res) {
  req.body.fteam = req.body.fteam.toUpperCase()
  req.body._id = req.body._id.toUpperCase()
  functionalteam.insert(req.body, function(err, result) {
    if(err) {
      return res.send({success:false,"message":"FUNCTIONAL TEAM ALREADY EXISTS"})
    }
    functionalteam.get(result.id, function(err, body) {
      if(err) {
        return res.send({success:false,"message":"FAILED TO ADD FUNCTIONAL TEAM"})
      }
      else {
        return res.send({success:true,"message":"SUCCESSFULLY ADDED FUNCTIONAL TEAM"});
      }
    })
  })
}

//delete functional team
module.exports.deletefteam = function(req, res) {
  functionalteam.destroy(req.body._id, req.body._rev, function(err, result) {
    if(err) {
      console.log("failed to delete");
      return res.send({"success":false,"message":"DELETED SUCCESSFULLY"});
    }
    else {
      return res.send({"success":true,"message":"DELETED SUCCESSFULLY"})
    }
  })
}


//get functional teams
module.exports.getfteam = function(req, res) {

  var arr = []
  functionalteam.list({include_docs: true}, function(err, result) {
    if(!result.total_rows)
    return res.send(arr);
    for(var i=0;i<result.total_rows;i++) {
      arr.push(result.rows[i].doc);
      if(i==result.total_rows-1) {
        res.send(arr);
      }
    }
  })
}

//adding new accomplishment
module.exports.addform = function(req, res) {
  var object = {
    userid: req.body.userid,
    date: req.body.date,
    type: req.body.type,
    title: req.body.title
  }

forms.list({include_docs: true}, function(err, result) {
  databasejson.data(result, object, function(status) {
    if(!status){
    forms.insert(req.body, function(err, result) {
      if(err) {
        return res.send({success:false,"message":"FAILED TO ADD ACCOMPLISHMENT"})
      }
      forms.get(result.id, function(err, body) {
        if(err) {
          return res.send({success:false,"message":"FAILED"})
        }
        else {
                                       var mgr_userid,mgr_mail;
                                           var self_userid=req.body.userid;
                                                var options = ['managerserialnumber','uid','preferredidentity'];
                                                        bluepages.getUserInfo({ email: self_userid},options,function(err,data){
                                                        if(err) console.log(err);
                                                        else {


                                                    //console.log(data);
                                                            mgr_userid= data.managerserialnumber + 744;
                                                                bluepages.getUserInfo({ uid: mgr_userid},options,function(err,data){
                                                        if(err) console.log(err);
                                                        else {
                                                                //console.log(data);
                                                                mgr_mail=data.preferredidentity;
                                                                console.log("manager mail id:"+mgr_mail);
                                                                        var mailOptions = {
                                                                          from: 'OPStool@in.ibm.com',
                                                                          to: 'smanjit@in.ibm.com',//add here var mgr_mail and make text change as per requirement
                                                                          subject: 'Ops Tool - New Accomplishment '+ object.type + ' ' + '"'+ object.title +'"'+ ' ' + self_userid + ' <<EOM>>',
                                                                          text: ' '
                                                                        };
                                                                        transporter.sendMail(mailOptions, function(error, info){
                                                                  if (error) {
                                                                        console.log(error);
                                                                  } else {
                                                                        console.log('Email sent: ' + info.response);
                                                                  }
                                                                });

                                                        }
                                                });

                                                        }
                                                });
//

//
          return res.send({success:true,"message":"SUCCESSFULLY ADDED ACCOMPLISHMENT"});
        }
      })
    })
  }
  else {
    console.log("duplicate");
    return res.send({success:false,"message":"DUPLICATE ACCOMPLISHMENT"});
  }
  })
})
}


//delete name of type
module.exports.deleteform = function(req, res) {
  console.log(req.body);
  forms.destroy(req.body._id, req.body._rev, function(err, result) {
    if(err) {
      console.log(err);
      console.log("failed to delete");
      return res.send({"success":false,"message":"DELETED SUCCESSFULLY"});
    }
    else {
      console.log("SUCCESSFULLY deleted");
      return res.send({"success":true,"message":"DELETED SUCCESSFULLY"})
    }
  })
}


// adding names to type
module.exports.addname = function(req,res){
var object1 = {
  type : req.body.type,
  name : req.body.name
}
names.list({include_docs: true}, function(err, result) {
  databasejson.data1(result, object1, function(status) {
    if(!status){
    names.insert(req.body, function(err, result) {
      if(err) {
        return res.send({success:false,"message":"FAILED"})
      }
      names.get(result.id, function(err, body) {
        if(err) {
          return res.send({success:false,"message":"FAILED"})
        }
        else {
          return res.send({success:true,"message":"SUCCESSFULLY ADDED"});
        }
      })
    })
  }
  else {
    console.log("duplicate");
    return res.send({success:false,"message":"DUPLICATE ENTRY"});
  }
  })
 })
}

//delete name of type
module.exports.deletename = function(req, res) {
  names.destroy(req.body._id, req.body._rev, function(err, result) {
    if(err) {
      console.log("failed to delete");
      return res.send({"success":false,"message":"DELETED SUCCESSFULLY"});
    }
    else {
      return res.send({"success":true,"message":"DELETED SUCCESSFULLY"})
    }
  })
}

//get type names
module.exports.gettypenames = function(req, res) {

  var arr = []
  names.list({include_docs: true}, function(err, result) {
    if(!result.total_rows)
    return res.send(arr);
    for(var i=0;i<result.total_rows;i++) {
      arr.push(result.rows[i].doc);
      if(i==result.total_rows-1) {
                  console.log(arr);
        res.send(arr);
      }
    }
  })
}


module.exports.update_user = function (req, res) {
    var object = {
    userid: req.body.userid,
    date: req.body.date,
    type: req.body.type,
    title: req.body.title
  }
  forms.list({include_docs: true}, function(err, result) {
  databasejson.data(result, object, function(status) {
    if(!status){
    forms.insert({
   "_id": req.body._id,
   "_rev": req.body._rev,
   "title": req.body.title,
   "type": req.body.type,
   "name": req.body.name,
   "date": req.body.date,
   "fteam": req.body.fteam,
   "description": req.body.description,
   "point": req.body.point,
   "userid": req.body.userid,
   "username": req.body.username,
  "cDate": req.body.cDate,
  "enddate": req.body.enddate,
  "ilc": req.body.ilc,
  "url": req.body.url
}, function(err, result) {
      if(err) {
        return res.send({success:false,"message":"FAILED TO ADD ACCOMPLISHMENT"})
      }
      forms.get(result.id, function(err, body) {
        if(err) {
                        console.log("fail");
          return res.send({success:false,"message":"FAILED"})
        }
        else {
                        console.log("Success");
          return res.send({success:true,"message":"SUCCESSFULLY ADDED ACCOMPLISHMENT"});
        }
      })
    })
  }
  else {
    console.log("New Accomplishment ");
    return res.send({success:false,"message":"NEW ACCOMPLISHMENT"});
  }
  })
 })
}
