# Update Point in form (opstool)
import couchdb;

def update_collect(dbname,user,password,field,value,conditions):
    couchserver = couchdb.Server("http://%s:%s@localhost:5984/" % (user, password))
    db=couchserver[dbname]
    ct=0
    for docid in db.view('_all_docs'):
     i = docid['id']
     doc=db.get(i)
     ct=ct+1;
     doc[field]=value
     print(ct,doc["title"])
     if conditions["title"] == doc["title"]: 
      print(ct,doc["point"])
      db.save(doc)
        
# Update Name (initcap) in form (opstool)
def update_collect1(dbname,user,password,field):
    couchserver = couchdb.Server("http://%s:%s@9.113.25.94:5984/" % (user, password))
    db=couchserver[dbname]
    ct=0
    for docid in db.view('_all_docs'):
     i = docid['id']
     doc=db.get(i)
     ct=ct+1;
     doc[field]=doc[field].title()
     print(ct,doc["name"])
     db.save(doc)
        
#update_collect("opsforms","admin","admin123","point","500",{"title":"IBM Sterling B2B Integrator v5.2.6.x Implementer Badge Path"})
#update_collect1("opsnames","admin","admin123","name")
# Update Name (initcap) in form (opstool)

def update_collect2(dbname,user,password):
    couchserver = couchdb.Server("http://%s:%s@localhost:5984/" % (user, password))
    db=couchserver[dbname]
    ct=0
    dict={}
    for docid in db.view('_all_docs'):
     i = docid['id']
     doc=db.get(i)
     ct=ct+1;
     dict[doc["name"]+':'+doc["type"]]=doc["point"]
#     print(doc["point"])
#    print(dict.items()) 

    couchserver = couchdb.Server("http://%s:%s@localhost:5984/" % (user, password))
    db=couchserver["opsforms"]
    ct=0
    doc={}
    for docid in db.view('_all_docs'):
     i = docid['id']
     doc=db.get(i)
     ct=ct+1;
     key=doc["name"]+':'+doc["type"]
     if key in dict:
      doc["point"]=dict[key]
     else:
      print(doc)
#     print(doc["point"],doc["name"],doc["type"])
     db.save(doc) 
        
update_collect2("opsnames","admin","admin123")
