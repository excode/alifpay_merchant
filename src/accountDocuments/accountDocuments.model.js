const pool = require("../db");
    const VCache = require('../../lib/cache');
    const funcs =  require("../../common/functions/funcs");
    const {queryFormatter,queryBuilder_string,
        queryBuilder_number,
        queryBuilder_date} = require("../../common/functions/queryutilPostgre")
    var sql = require('yesql').pg
    const crypto = require('crypto');
    
      exports.findById = (id,extraFields) => {
        return new Promise((resolve, reject) => {
        ;(async () => {
            let vals= {'id':id}; 
       
            const extra = queryFormatter(extraFields)
            let searchConditions=""
            if(extra.cols.length>0){
                vals={...vals,...extra.vals};
                searchConditions=" AND " + extra.cols.join(" AND ")
            }
            const client = await pool.connect()
            try {
               // console.log(vals)
                const queryText = 'SELECT * from accountdocuments where id=:id '+searchConditions+' LIMIT 1'
               
                const list = await client.query(sql(queryText)(vals))
               //  console.log(sql(queryText)(vals));
               // console.log(list.rows[0]);
                VCache.setCache("offer_list_"+id,list.rows[0]);
                if(list.rows.length>0){
                    resolve(list.rows[0]);
                }else{
                    reject("NO_DATA")
                }
                
               
            } catch (e) {
              console.log(e)
                reject(e);
                
            } finally {
                client.release()
            }
            })().catch(e =>  reject(e.stack))
        });
        
      };
      exports.findByDocType = (email,doctype) => {
        return new Promise((resolve, reject) => {
        ;(async () => {
            let vals= {'createby':email,'documenttype':doctype}; 
       
            
            const client = await pool.connect()
            try {
               
                const queryText = 'SELECT * from accountdocuments where createby=:createby and documenttype=:documenttype ORDER BY createat DESC LIMIT 1'
               
                const list = await client.query(sql(queryText)(vals))
               
                if(list.rows.length>0){
                    resolve(list.rows[0]);
                    //resolve({file:doctype+"_data",documentnumber:doctype});
                }else{
                    resolve({})
                }
                
               
            } catch (e) {
              console.log(e)
              resolve({});
                
            } finally {
                client.release()
            }
            })().catch(e =>  resolve({}))
        });
        
      };
      exports.findOne = (querys) => {
        const {cols,vals} = queryFormatter(querys)
        var condition=cols.length>0?" WHERE "+cols.join(" AND ") :""
        return new Promise((resolve, reject) => {
        ;(async () => {
           
            const client = await pool.connect()
            try {
                const queryText = 'SELECT * from accountdocuments '+condition+' LIMIT 1'
                const list = await client.query(sql(queryText)(vals))
                resolve(list.rows[0]);
            } catch (e) {
              
                reject(e);
                
            } finally {
                client.release()
            }
            })().catch(e =>  reject(e.stack))
        });
        
      };

      exports.createAccountDocuments = (body) => {
          
    var cols=[];
    var param=[];
    var vals = {};
    cols.push("id");
    param.push(":id");
    vals['id'] =crypto.randomUUID();
                         
if(body.createby!=undefined){
    cols.push("createby");
    param.push(":createby");
    vals['createby'] = body.createby ; 
}
                         
if(body.createat!=undefined){
    cols.push("createat");
    param.push(":createat");
    vals['createat'] = body.createat ; 
}
if(body.filedata!=undefined){
    cols.push("filedata");
    param.push(":filedata");
    vals['filedata'] = body.filedata ; 
}
if(body.file!=undefined){
    cols.push("file");
    param.push(":file");
    vals['file'] = body.file ; 
}
                         
if(body.updateby!=undefined){
    cols.push("updateby");
    param.push(":updateby");
    vals['updateby'] = body.updateby ; 
}
                         
if(body.updateat!=undefined){
    cols.push("updateat");
    param.push(":updateat");
    vals['updateat'] = body.updateat ; 
}
                      
if(body.accountid!=undefined){
    cols.push("accountid");
    param.push(":accountid");
    vals['accountid'] = parseInt(body.accountid) ;
}
                         
if(body.documenttype!=undefined){
    cols.push("documenttype");
    param.push(":documenttype");
    vals['documenttype'] = body.documenttype ; 
}
                         
if(body.documentnumber!=undefined){
    cols.push("documentnumber");
    param.push(":documentnumber");
    vals['documentnumber'] = body.documentnumber ; 
}
                         
if(body.photo1!=undefined){
    cols.push("photo1");
    param.push(":photo1");
    vals['photo1'] = body.photo1 ; 
}
                         
if(body.photo2!=undefined){
    cols.push("photo2");
    param.push(":photo2");
    vals['photo2'] = body.photo2 ; 
}
                         
if(body.verified!=undefined){
    cols.push("verified");
    param.push(":verified");
    vals['verified'] = body.verified ; 
}

if(body.verfricationstatus!=undefined){
    cols.push("verfricationstatus");
    param.push(":verfricationstatus");
    vals['verfricationstatus'] = parseFloat(body.verfricationstatus) ;  
}
    
          var column = cols.join(',');
          var params = param.join(',');
          return new Promise((resolve, reject) => {
          ;(async () => {
            
            const client = await pool.connect()
            try {
                
                await client.query('BEGIN');
                const queryText = 'INSERT INTO accountdocuments('+column+') VALUES('+params+') RETURNING id ';
                const add = await client.query(sql(queryText)(vals));
                await client.query('COMMIT');
                if(add.rowCount>0){
                    resolve(add.rows[0]);
                }else{
                    reject("DATA NOT SAVED");
                }
                
            } catch (e) {
                await client.query('ROLLBACK')
                console.log(e);
                reject(e);
            } finally {
                client.release()
            }
            })().catch(e =>  reject(e))
        });
      };
      
      exports.list = (perPage, page , req ) => {
            
            const query = req;
            let sortBy='id';
            let sortDirection='ASC';
            let offset = perPage* page;
             
    var cols=[];
    var vals = {};
    

    
    query.createby_mode = "equals"
    if(query.createby){
        let createby_ = queryBuilder_string(query,"createby","createby")
        cols.push(createby_);
        vals['createby'] = query.createby;
       
    }
    if(query.createby_array){
        if(Array.isArray(query.createby_array) && query.createby_array.length>1){
            cols.push(" createby = ANY(:createby) ");
            const createbyString = query.createby_array.map((data) => data);
            vals['createby'] = createbyString;
        }
    }


        if(query.createat){
            let createat_ = queryBuilder_date(query,"createat","createat")
            cols.push(createat_);
            vals['createat'] = query.createat;   
        }
        if(query.createat_array){
            if(Array.isArray(query.createat_array) && query.createat_array.length==2){
                cols.push(" createat BETWEEN :createat_1 AND  :createat_2 ");
                vals['createat_1'] = new Date(query.createat_array[0])
                vals['createat_2'] = new Date(query.createat_array[1])
            }else if(Array.isArray(query.createat_array) && query.createat_array.length>2){
                cols.push(" createat = ANY(:createat::date[]) ");
                const createatString = query.createat_array.map((date) => date);
                vals['createat'] = createatString;
            }
        }
    

    
    query.updateby_mode = "equals"
    if(query.updateby){
        let updateby_ = queryBuilder_string(query,"updateby","updateby")
        cols.push(updateby_);
        vals['updateby'] = query.updateby;
       
    }
    if(query.updateby_array){
        if(Array.isArray(query.updateby_array) && query.updateby_array.length>1){
            cols.push(" updateby = ANY(:updateby) ");
            const updatebyString = query.updateby_array.map((data) => data);
            vals['updateby'] = updatebyString;
        }
    }


        if(query.updateat){
            let updateat_ = queryBuilder_date(query,"updateat","updateat")
            cols.push(updateat_);
            vals['updateat'] = query.updateat;   
        }
        if(query.updateat_array){
            if(Array.isArray(query.updateat_array) && query.updateat_array.length==2){
                cols.push(" updateat BETWEEN :updateat_1 AND  :updateat_2 ");
                vals['updateat_1'] = new Date(query.updateat_array[0])
                vals['updateat_2'] = new Date(query.updateat_array[1])
            }else if(Array.isArray(query.updateat_array) && query.updateat_array.length>2){
                cols.push(" updateat = ANY(:updateat::date[]) ");
                const updateatString = query.updateat_array.map((date) => date);
                vals['updateat'] = updateatString;
            }
        }
    

    if(query.accountid!=null ){
      if(!isNaN(query.accountid)){
        let accountid_ = queryBuilder_number(query,"accountid","accountid")
        cols.push(accountid_);
        vals['accountid'] = query.accountid;
      }
    }
    if(query.accountid_array){
        if(Array.isArray(query.accountid_array) && query.accountid_array.length==2){
            cols.push(" accountid BETWEEN :accountid_1 AND  :accountid_2 ");
            vals['accountid_1'] = query.accountid_array[0]
            vals['accountid_2'] = query.accountid_array[1]
        }else if(Array.isArray(query.accountid_array) && query.accountid_array.length>2){
            cols.push(" accountid = ANY(:accountid) ");
            const accountidString = query.accountid_array.map((num) => num);
            vals['accountid'] = accountidString;
        }
    }


    
    if(query.documenttype){
        
        cols.push(" documenttype=:documenttype");
        vals['documenttype'] = query.documenttype;
       
    }
    if(query.documentnumber_array){
        if(Array.isArray(query.documentnumber_array) && query.documentnumber_array.length>1){
            cols.push(" documentnumber = ANY(:documentnumber) ");
            const documentnumberString = query.documentnumber_array.map((data) => data);
            vals['documentnumber'] = documentnumberString;
        }
    }


    if(query.verified!=null){
        cols.push("verified =  :verified  ");
        vals['verified'] = query.verified;
    }
            

    if(query.verfricationstatus!=null ){
      if(!isNaN(query.verfricationstatus)){
        let verfricationstatus_ = queryBuilder_number(query,"verfricationstatus","verfricationstatus")
        cols.push(verfricationstatus_);
        vals['verfricationstatus'] = query.verfricationstatus;
      }
    }
    if(query.verfricationstatus_array){
        if(Array.isArray(query.verfricationstatus_array) && query.verfricationstatus_array.length==2){
            cols.push(" verfricationstatus BETWEEN :verfricationstatus_1 AND  :verfricationstatus_2 ");
            vals['verfricationstatus_1'] = query.verfricationstatus_array[0]
            vals['verfricationstatus_2'] = query.verfricationstatus_array[1]
        }else if(Array.isArray(query.verfricationstatus_array) && query.verfricationstatus_array.length>2){
            cols.push(" verfricationstatus = ANY(:verfricationstatus) ");
            const verfricationstatusString = query.verfricationstatus_array.map((num) => num);
            vals['verfricationstatus'] = verfricationstatusString;
        }
    }

             let searchConditions =' WHERE 1=1 ';
             if(cols.length>0){
                searchConditions +=' AND ' + cols.join(' AND ' );
             }
           
                sortBy = "createat";
            
            
            sortDirection =  "DESC";
            return new Promise((resolve, reject) => {
            ;(async () => {
           
                const client = await pool.connect()
                try {
                 
                    const queryText = 'SELECT id,documenttype,file from accountdocuments' +searchConditions+' order by '+sortBy+' '+sortDirection+' LIMIT 1 ';
                    const list = await client.query(sql(queryText)(vals));
                    //const queryTextCount = 'SELECT COUNT(*) as total from accountdocuments' +searchConditions
                    //console.log(sql(queryText)(vals))
                   // const total = await client.query(sql(queryTextCount)(vals));
                    //VCache.setCache("offer_list",list.rows);
                    if(list.rows.length>0){
                        resolve(list.rows[0]);
                    }else{
                        reject("NO_DATA")
                    }
                   
                   
                } catch (e) {
                  
                   // throw e
                    reject(e);
                } finally {
                    client.release()
                }
                })().catch(e =>  reject(e.stack))
            });
           
      };
      exports.listAll = (querys={} ) => {
        const perPage =300;//LIMIT
        
        const {cols,vals} = queryFormatter(querys)
        var searchConditions=cols.length>0?" WHERE "+cols.join(" AND ") :"" 
        return new Promise((resolve, reject) => {
        ;(async () => {
       
            const client = await pool.connect()
            try {
             
                const queryText = 'SELECT * from accountdocuments' +searchConditions+'  LIMIT '+perPage;
                const list = await client.query(sql(queryText)(vals));
                
               resolve( list.rows);
               
            } catch (e) {
              
               // throw e
                reject(e);
            } finally {
                client.release()
            }
            })().catch(e =>  reject(e.stack))
        });
       
  };
  exports.listSuggestions = (query) => {
    const { search, ...queryWithoutSearch } = query  
    var querys=queryWithoutSearch
    const perPage =50;//LIMIT
    let sortBy='id';
    let sortDirection='ASC';
    let keyConditions =` WHERE  (documentnumber LIKe '%' || :search || '%' )`;
    // If you want restrict the data for any specific group/user/organization like user='ucode' 
    // use can supply 
    // querys={user:'ucode'}
    //or exclude a group {user:{ne:'ucode'}}  
    const extra = queryFormatter(querys)
    var vals={search:search};
    let searchConditions=keyConditions
    if(extra.cols.length>0){
        vals={search:search,...extra.vals};
        searchConditions=+ extra.cols.join(" AND ")
    }
    return new Promise((resolve, reject) => {
    ;(async () => {
   
        const client = await pool.connect()
        try {
         
            const queryText = 'SELECT * from accountdocuments' +searchConditions+' order by '+sortBy+' '+sortDirection+' LIMIT '+perPage;
            const list = await client.query(sql(queryText)(vals));
           resolve( list.rows);
           
        } catch (e) {
          
           // throw e
            reject(e);
        } finally {
            client.release()
        }
        })().catch(e =>  reject(e.stack))
    });
   
};
      exports.patchAccountDocuments = (id, reqData,extraFields={}) => {
        var body = reqData;
        
    var cols=[];
    var vals = {};
    
                             
if(body.createby!=undefined){
    cols.push("createby = :createby");
    vals['createby'] = body.createby ;  
}
                             
if(body.createat!=undefined){
    cols.push("createat = :createat");
    vals['createat'] = body.createat ;  
}
                             
if(body.updateby!=undefined){
    cols.push("updateby = :updateby");
    vals['updateby'] = body.updateby ;  
}
                             
if(body.updateat!=undefined){
    cols.push("updateat = :updateat");
    vals['updateat'] = body.updateat ;  
}
                             
if(body.accountid!=undefined){
    cols.push("accountid = :accountid");
    vals['accountid'] = parseInt(body.accountid) ; 
}
                             
if(body.documenttype!=undefined){
    cols.push("documenttype = :documenttype");
    vals['documenttype'] = body.documenttype ;  
}
                             
if(body.documentnumber!=undefined){
    cols.push("documentnumber = :documentnumber");
    vals['documentnumber'] = body.documentnumber ;  
}
                             
if(body.photo1!=undefined){
    cols.push("photo1 = :photo1");
    vals['photo1'] = body.photo1 ;  
}
                             
if(body.photo2!=undefined){
    cols.push("photo2 = :photo2");
    vals['photo2'] = body.photo2 ;  
}
                             
if(body.verified!=undefined){
    cols.push("verified = :verified");
    vals['verified'] = body.verified ;  
}

if(body.verfricationstatus!=undefined){
    cols.push("verfricationstatus = :verfricationstatus");
    vals['verfricationstatus'] = parseFloat(body.verfricationstatus) ;    
}
        vals= {...vals,id:id}; 
        var column = cols.join(',');
        const extra = queryFormatter(extraFields)
        let searchConditions=""
        if(extra.cols.length>0){
            vals={...vals,...extra.vals};
            searchConditions=" AND " + extra.cols.join(" AND ")
        }
        return new Promise((resolve, reject) => {
        ;(async () => {
          
          const client = await pool.connect()
          try {
             
              await client.query('BEGIN');
              const queryText = 'UPDATE accountdocuments SET '+column+'  WHERE id =:id'+searchConditions
              const updated = await client.query(sql(queryText)(vals));
              //console.log(sql(queryText)(vals))
              await client.query('COMMIT');
              //VCache.resetCache("accountdocuments_list");
              resolve(updated);
          } catch (e) {
              await client.query('ROLLBACK')
              console.log(e);
              reject(e);
          } finally {
              client.release()
          }
          })().catch(e =>  reject(e))
      });
      
      };
      
      exports.removeById = (accountdocumentsId,extraFields={}) => {
          return new Promise((resolve, reject) => {
            ;(async () => {
                const extra = queryFormatter(extraFields)
                let vals= {id:accountdocumentsId};
                let searchConditions=""
                if(extra.cols.length>0){
                    vals={...vals,...extra.vals};
                    searchConditions=" AND " + extra.cols.join(" AND ")
                }
                const client = await pool.connect()
                try {
                    await client.query('BEGIN')
                    const queryText = 'DELETE FROM accountdocuments  WHERE  id=:id '+searchConditions
                    const deleted = await client.query(sql(queryText)(vals))
                   
                    await client.query('COMMIT')
                    resolve(deleted);
                } catch (e) {
                    await client.query('ROLLBACK')
                    reject(e);
                } finally {
                    client.release()
                }
                })().catch(e => reject(e.stack))
          });
      };
      
    exports.uploadFile = (req) => {
        return new Promise(async(resolve, reject) => {
            if(req.file.size>1*1024*1024){ // you can chnage the file upload limit
                reject('file_size_too_big');
            }
            let colName = req.params.columnName.toLowerCase()
            let rowId = req.params.rowId
            let uploadedFileName =req.file.filename;
            ;(async () => {
           
                const client = await pool.connect()
                try {
              await client.query('BEGIN');
              const queryText = 'UPDATE accountdocuments SET '+colName+'=:0  where id =:1';
              const updated = await client.query(sql(queryText)([uploadedFileName,rowId]));
              //console.log(sql(queryText)(vals))
              await client.query('COMMIT');
              //VCache.resetCache("accountdocuments_list");
              resolve(uploadedFileName)
            } catch (e) {
              
                reject(e);
                
            } finally {
                client.release()
            }
            })().catch(e =>  reject(e.stack))
        });
        };
        
  