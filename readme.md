**Clone repository**


git clone https://github.ibm.com/nitingupta/ops_tool.git

**Change directory**

   opsTool folder
   
   
**Start server**

   npm start


**_Old Notes_**

step 1)create database collections in couch db using commands
   curl -X PUT http://admin:admin123@127.0.0.1:5984/forms
   curl -X PUT http://admin:admin123@127.0.0.1:5984/delegate
   curl -X PUT http://admin:admin123@127.0.0.1:5984/functionalteam
   curl -X PUT http://admin:admin123@127.0.0.1:5984/names

step 2)change the port number in the file server.js

step 3)change the ldap group names in server/login.js

step 4)run the application and via admin visit manage --> add names (to add names and points for the types)
