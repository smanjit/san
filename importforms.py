#Ops Tool Bulk  Import 
import couchdb
import csv
from datetime import datetime

couch = couchdb.Server("http://admin:admin123@9.113.25.94:5984/")
try :
    db = couch['forms']
except Exception as e:
    couch.create(forms)
db=couch['forms']

with open('forms.csv',encoding='utf-8-sig') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        try:
            date=row['DATE']
            datetime.strptime(date, '%Y/%m/%d %H:%M:%S')
        except ValueError:
            print("Invalid DateTime Format \r Use yyyy/mm/dd hh:mm:ss")
        else:
            db.save({"title":row['TITLE'],"type":row['TYPE'],"name":row['NAME'],"date":date,"fteam":row['FTEAM'],"description":row['DESCRIPTION'],"point":row['POINT'],"userid":row['USERID'],"username":row['USERNAME']})
            count=0
            print("'"+row['USERNAME']+","+row['TITLE']+"'"+" INSERTED SUCESSFULLY!!")
            for docid in db.view('_all_docs'):
                if db[docid['id']]['username']==row['USERNAME'] and db[docid['id']]['userid']==row['USERID'] and db[docid['id']]['title']==row['TITLE']:
                    count+=1
                    if count >1:
                        doc=db[docid['id']]
                        print("'"+row['USERNAME']+","+row['TITLE']+"'"+" ALREADY EXISTS!!")
                        db.delete(doc)
