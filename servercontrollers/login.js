var bluepages = require('bluepages');
var admin_group='RSC_BO';
var user_group='RSC_Commerce_Services';
var lead_group='RSC_Commerce_Services_Lead';

var options = ['name']

module.exports.login = function(req, res) {
  console.log("LET'S SEE");

  bluepages.authenticate(req.body.userid, req.body.pass ,function(err,verified){
    if(err) {
      console.log(err);
      res.send({success: false, message: "INVALID credentials!", group: null})
    }
    else {
      if(verified){
        bluepages.authenticateGroup(req.body.userid, admin_group, function(err,verified){
          if(err) {
               console.log(err);
               res.send({success: false, message: "ENTER CREDENTIALS", group: null})
             }
         else {
           if(verified) {
             console.log('The user is present in '+ admin_group +' group');
             bluepages.getUserInfo({email: req.body.userid}, options, function(err, result) {
                     if(err) {
                       console.log('Failed to fetch userinfo');
                       res.send({success: true, message: "Success ADMIN login!", group: 'admin', userid:req.body.userid ,username:" "})
                     }
                     else {
                       console.log('Userinfo fetched!')
                       console.log(result)
                       res.send({success: true, message: "Success ADMIN login!", group: 'admin', userid:req.body.userid, username: result.name})
                     }
                   })
           }
           else {
//             console.log('The user is NOT present in '+ admin +' group');

             bluepages.authenticateGroup(req.body.userid, lead_group, function(err,verified){
               if(err) {
                    console.log(err);
                    res.send({success: false, message: "ENTER CREDENTIALS", group: null})
                  }
              else {
                if(verified) {
                  console.log('The user is present in '+ lead_group +' group');
                  bluepages.getUserInfo({email: req.body.userid}, options, function(err, result) {
                          if(err) {
                            console.log('Failed to fetch userinfo');
                            res.send({success: true, message: "Success lead login!", group: 'lead', userid:req.body.userid, username: " "})
                          }
                          else {
                            console.log('Userinfo fetched!')
                            console.log(result)
                            res.send({success: true, message: "Success lead login!", group: 'lead', userid:req.body.userid, username: result.name})
                          }
                        })
                }
                else {
                  //console.log('The user is NOT present in '+ lead +' group');
                  bluepages.authenticateGroup(req.body.userid, user_group, function(err,verified){
                    if(err) {
                         console.log(err);
                         res.send({success: false, message: "ENTER CREDENTIALS", group: null})
                       }
                   else {
                     if(verified) {
                       console.log('The user is present in '+ user_group +' group');
                       bluepages.getUserInfo({email: req.body.userid}, options, function(err, result) {
                               if(err) {
                                 console.log('Failed to fetch userinfo');
                                 res.send({success: true, message: "Success user login!", group: 'user', userid:req.body.userid, username: " "})
                               }
                               else {
                                 console.log('Userinfo fetched!')
                                 console.log(result)
                                 res.send({success: true, message: "Success user login!", group: 'user', userid:req.body.userid, username: result.name})
                               }
                             })
                     }
                     else {
                       console.log('The user is NOT present in '+ user +' group');
                       res.send({success: false, message: "ENTER CREDENTIALS", group: null})
                     }
                   }
                 });
              }
            }
            });
           }
         }
       });
     }
      else {
          console.log("Invalid credentials!");
          res.send({success: false, message: "Invalid credentials!", group: null})
        }
    }
    });
  }

  //
  // module.exports.login = function(req, res) {
  //   console.log(req.body);
  //   if(req.body.userid=="admin" && req.body.pass=="admin")
  //   		return res.send({success: true, message: "Success" , group:"admin" , userid:req.body.userid ,username : "admin"});
  //   if(req.body.userid=="lead" && req.body.pass=="lead")
  //           return res.send({success: true, message: "Success" , group:"lead" , userid:req.body.userid ,username : "lead" });
  //   if(req.body.userid=="lead1" && req.body.pass=="lead1")
  //               return res.send({success: true, message: "Success" , group:"lead" , userid:req.body.userid , username : "lead1" });
  //   if(req.body.userid=="user" && req.body.pass=="user")
  //                   return res.send({success: true, message: "Success" , group:"user" , userid:req.body.userid , username : "user" });
  //  if(req.body.userid=="user1" && req.body.pass=="user1")
  //                       return res.send({success: true, message: "Success" , group:"user" , userid:req.body.userid, username : "user1" });
  //  if(req.body.userid=="user2" && req.body.pass=="user2")
  //                      return res.send({success: true, message: "Success" , group:"user" , userid:req.body.userid, username : "user2" });
  // 	else
  //     return res.send({success: false, message: "Login Failed"});
  // }
