const pool = require("../db");
    const VCache = require('../../lib/cache');
    const funcs =  require("../../common/functions/funcs");
    const {queryFormatter,queryBuilder_string,
        queryBuilder_number,
        queryBuilder_date} = require("../../common/functions/queryutilPostgre")
    var sql = require('yesql').pg
    
    
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
             
                const queryText = 'SELECT * from ownerdetails where id=:id '+searchConditions+' LIMIT 1'
                const list = await client.query(sql(queryText)(vals))
                VCache.setCache("offer_list_"+id,list.rows[0]);
                resolve(list.rows[0]);
               
            } catch (e) {
              
                reject(e);
                
            } finally {
                client.release()
            }
            })().catch(e =>  reject(e.stack))
        });
        
      };
      exports.findOne = (querys) => {
        const {cols,vals} = queryFormatter(querys)
        var condition=cols.length>0?" WHERE "+cols.join(" AND ") :""
        return new Promise((resolve, reject) => {
        ;(async () => {
           
            const client = await pool.connect()
            try {
                const queryText = 'SELECT * from ownerdetails '+condition+' LIMIT 1'
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

exports.findByContactnumber = (contactnumber) => {
    return new Promise((resolve, reject) => {
    ;(async () => {
        
        const client = await pool.connect()
        try {
            
            const queryText = 'SELECT * from ownerdetails where contactnumber=:contactnumber LIMIT 1'
            const list = await client.query(sql(queryText)({contactnumber:contactnumber}))
            resolve(list.rows[0]);
            
        } catch (e) {
            
            reject(e);
            
        } finally {
            client.release()
        }
        })().catch(e =>  reject(e.stack))
    });
    
    };
        

exports.findByEmail = (email) => {
    return new Promise((resolve, reject) => {
    ;(async () => {
        
        const client = await pool.connect()
        try {
            
            const queryText = 'SELECT * from ownerdetails where email=:email LIMIT 1'
            const list = await client.query(sql(queryText)({email:email}))
            resolve(list.rows[0]);
            
        } catch (e) {
            
            reject(e);
            
        } finally {
            client.release()
        }
        })().catch(e =>  reject(e.stack))
    });
    
    };
        

exports.findByIcno = (icno) => {
    return new Promise((resolve, reject) => {
    ;(async () => {
        
        const client = await pool.connect()
        try {
            
            const queryText = 'SELECT * from ownerdetails where icno=:icno LIMIT 1'
            const list = await client.query(sql(queryText)({icno:icno}))
            resolve(list.rows[0]);
            
        } catch (e) {
            
            reject(e);
            
        } finally {
            client.release()
        }
        })().catch(e =>  reject(e.stack))
    });
    
    };
        
      exports.createOwnerDetails = async(body) => {
          
    var cols=[];
    var param=[];
    var vals = {};
    
                         
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
                         
if(body.name!=undefined){
    cols.push("name");
    param.push(":name");
    vals['name'] = body.name ; 
}
                         
if(body.contactnumber!=undefined){
    cols.push("contactnumber");
    param.push(":contactnumber");
    vals['contactnumber'] = body.contactnumber ; 
}
                         
if(body.email!=undefined){
    cols.push("email");
    param.push(":email");
    vals['email'] = body.email ; 
}
                         
if(body.icno!=undefined){
    cols.push("icno");
    param.push(":icno");
    vals['icno'] = body.icno ; 
}
                         
if(body.icfrontimage!=undefined){
    cols.push("icfrontimage");
    param.push(":icfrontimage");
    vals['icfrontimage'] = body.icfrontimage ; 
}
                         
if(body.icbackimage!=undefined){
    cols.push("icbackimage");
    param.push(":icbackimage");
    vals['icbackimage'] = body.icbackimage ; 
}
    
          var column = cols.join(',');
          var params = param.join(',');
          return new Promise((resolve, reject) => {
          ;(async () => {
            
            const client = await pool.connect()
            try {
                
        let   contactnumberCHeck =await this.findOne({"contactnumber":body.contactnumber})
          if(contactnumberCHeck ) {
            reject("contactnumber exists");
            return;
          }
        
        let   emailCHeck =await this.findOne({"email":body.email})
          if(emailCHeck ) {
            reject("email exists");
            return;
          }
        
        let   icnoCHeck =await this.findOne({"icno":body.icno})
          if(icnoCHeck ) {
            reject("icno exists");
            return;
          }
        
                await client.query('BEGIN');
                const queryText = 'INSERT INTO ownerdetails('+column+') VALUES('+params+') RETURNING id ';
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
    

    
    if(query.name){
        let name_ = queryBuilder_string(query,"name","name")
        cols.push(name_);
        vals['name'] = query.name;
       
    }
    if(query.name_array){
        if(Array.isArray(query.name_array) && query.name_array.length>1){
            cols.push(" name = ANY(:name) ");
            const nameString = query.name_array.map((data) => data);
            vals['name'] = nameString;
        }
    }


    
    if(query.contactnumber){
        let contactnumber_ = queryBuilder_string(query,"contactnumber","contactnumber")
        cols.push(contactnumber_);
        vals['contactnumber'] = query.contactnumber;
       
    }
    if(query.contactnumber_array){
        if(Array.isArray(query.contactnumber_array) && query.contactnumber_array.length>1){
            cols.push(" contactnumber = ANY(:contactnumber) ");
            const contactnumberString = query.contactnumber_array.map((data) => data);
            vals['contactnumber'] = contactnumberString;
        }
    }


    
    if(query.email){
        let email_ = queryBuilder_string(query,"email","email")
        cols.push(email_);
        vals['email'] = query.email;
       
    }
    if(query.email_array){
        if(Array.isArray(query.email_array) && query.email_array.length>1){
            cols.push(" email = ANY(:email) ");
            const emailString = query.email_array.map((data) => data);
            vals['email'] = emailString;
        }
    }


    
    if(query.icno){
        let icno_ = queryBuilder_string(query,"icno","icno")
        cols.push(icno_);
        vals['icno'] = query.icno;
       
    }
    if(query.icno_array){
        if(Array.isArray(query.icno_array) && query.icno_array.length>1){
            cols.push(" icno = ANY(:icno) ");
            const icnoString = query.icno_array.map((data) => data);
            vals['icno'] = icnoString;
        }
    }

             let searchConditions =' WHERE 1=1 ';
             if(cols.length>0){
                searchConditions +=' AND ' + cols.join(' AND ' );
             }
            if(query.sortBy){
                sortBy = query.sortBy;
            }
            if(query.sortDirection){
    
                sortDirection = query.sortDirection =="1"?"ASC":"DESC";
            }
            return new Promise((resolve, reject) => {
            ;(async () => {
           
                const client = await pool.connect()
                try {
                 
                    const queryText = 'SELECT * from ownerdetails' +searchConditions+' order by '+sortBy+' '+sortDirection+' LIMIT '+perPage+' OFFSET '+offset;
                    const list = await client.query(sql(queryText)(vals));
                    const queryTextCount = 'SELECT COUNT(*) as total from ownerdetails' +searchConditions
                    //console.log(sql(queryText)(vals))
                    const total = await client.query(sql(queryTextCount)(vals));
                    //VCache.setCache("offer_list",list.rows);
                   resolve( { docs:list.rows, count: total.rows[0].total ,perpage:perPage,page:page });
                   
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
             
                const queryText = 'SELECT * from ownerdetails' +searchConditions+'  LIMIT '+perPage;
                const list = await client.query(sql(queryText)(vals));
                console.log(sql(queryText)(vals))
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
    let keyConditions =` WHERE  (name LIKe '%' || :search || '%' 
 OR contactnumber LIKe '%' || :search || '%' 
 OR email LIKe '%' || :search || '%' 
 OR icno LIKe '%' || :search || '%' )`;
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
         
            const queryText = 'SELECT * from ownerdetails' +searchConditions+' order by '+sortBy+' '+sortDirection+' LIMIT '+perPage;
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
      exports.patchOwnerDetails = async(id, reqData,extraFields={}) => {
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
                             
if(body.name!=undefined){
    cols.push("name = :name");
    vals['name'] = body.name ;  
}
                             
if(body.contactnumber!=undefined){
    cols.push("contactnumber = :contactnumber");
    vals['contactnumber'] = body.contactnumber ;  
}
                             
if(body.email!=undefined){
    cols.push("email = :email");
    vals['email'] = body.email ;  
}
                             
if(body.icno!=undefined){
    cols.push("icno = :icno");
    vals['icno'] = body.icno ;  
}
                             
if(body.icfrontimage!=undefined){
    cols.push("icfrontimage = :icfrontimage");
    vals['icfrontimage'] = body.icfrontimage ;  
}
                             
if(body.icbackimage!=undefined){
    cols.push("icbackimage = :icbackimage");
    vals['icbackimage'] = body.icbackimage ;  
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
             
        if(body.contactnumber!=undefined){
        let   contactnumberCHeck =await this.findOne({id:{ne:id},"contactnumber":body.contactnumber})
          if(contactnumberCHeck ) {
            reject("contactnumber exists");
            return;
          }
        }
        
        if(body.email!=undefined){
        let   emailCHeck =await this.findOne({id:{ne:id},"email":body.email})
          if(emailCHeck ) {
            reject("email exists");
            return;
          }
        }
        
        if(body.icno!=undefined){
        let   icnoCHeck =await this.findOne({id:{ne:id},"icno":body.icno})
          if(icnoCHeck ) {
            reject("icno exists");
            return;
          }
        }
        
              await client.query('BEGIN');
              const queryText = 'UPDATE ownerdetails SET '+column+'  WHERE id =:id'+searchConditions
              const updated = await client.query(sql(queryText)(vals));
              //console.log(sql(queryText)(vals))
              await client.query('COMMIT');
              //VCache.resetCache("ownerdetails_list");
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
      
      exports.removeById = (ownerdetailsId,extraFields={}) => {
          return new Promise((resolve, reject) => {
            ;(async () => {
                const extra = queryFormatter(extraFields)
                let vals= {id:ownerdetailsId};
                let searchConditions=""
                if(extra.cols.length>0){
                    vals={...vals,...extra.vals};
                    searchConditions=" AND " + extra.cols.join(" AND ")
                }
                const client = await pool.connect()
                try {
                    await client.query('BEGIN')
                    const queryText = 'DELETE FROM ownerdetails  WHERE  id=:id '+searchConditions
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
              const queryText = 'UPDATE ownerdetails SET '+colName+'=:0  where id =:1';
              const updated = await client.query(sql(queryText)([uploadedFileName,rowId]));
              //console.log(sql(queryText)(vals))
              await client.query('COMMIT');
              //VCache.resetCache("ownerdetails_list");
              resolve(uploadedFileName)
            } catch (e) {
              
                reject(e);
                
            } finally {
                client.release()
            }
            })().catch(e =>  reject(e.stack))
        });
        };
        
  