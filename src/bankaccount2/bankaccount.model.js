const pool = require("../db");
    const VCache = require('../../lib/cache');
    const funcs =  require("../../common/functions/funcs");
    const CasaModel = require('../../src/casa/casa.model');
    const fs   = require('fs')
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
             
                const queryText = 'SELECT * from bankaccount where id=:id '+searchConditions+' LIMIT 1'
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
                const queryText = 'SELECT * from bankaccount '+condition+' LIMIT 1'
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

exports.createBankaccount = (body) => {
          
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
                         
if(body.acctype_desc!=undefined){
    cols.push("acctype_desc");
    param.push(":acctype_desc");
    vals['acctype_desc'] = body.acctype_desc ; 
}
                      
if(body.doc_status_id!=undefined){
    cols.push("doc_status_id");
    param.push(":doc_status_id");
    vals['doc_status_id'] = parseInt(body.doc_status_id) ;
}
                      
if(body.bank_id!=undefined){
    cols.push("bank_id");
    param.push(":bank_id");
    vals['bank_id'] = parseInt(body.bank_id) ;
}
                         
if(body.bank_name!=undefined){
    cols.push("bank_name");
    param.push(":bank_name");
    vals['bank_name'] = body.bank_name ; 
}
                         
if(body.acc_no!=undefined){
    cols.push("acc_no");
    param.push(":acc_no");
    vals['acc_no'] = body.acc_no ; 
}

if(body.acctype_id!=undefined){
    cols.push("acctype_id");
    param.push(":acctype_id");
    vals['acctype_id'] = parseFloat(body.acctype_id) ;  
}
                      
if(body.bankinfo_id!=undefined){
    cols.push("bankinfo_id");
    param.push(":bankinfo_id");
    vals['bankinfo_id'] = parseInt(body.bankinfo_id) ;
}
                         
if(body.acc_desc!=undefined){
    cols.push("acc_desc");
    param.push(":acc_desc");
    vals['acc_desc'] = body.acc_desc ; 
}
                         
if(body.bank_logo_url!=undefined){
    cols.push("bank_logo_url");
    param.push(":bank_logo_url");
    vals['bank_logo_url'] = body.bank_logo_url ; 
}
                         
if(body.bank_logo_URL!=undefined){
    cols.push("bank_logo_url");
    param.push(":bank_logo_url");
    vals['bank_logo_url'] = body.bank_logo_URL ; 
}
  
    
          var column = cols.join(',');
          var params = param.join(',');
          return new Promise((resolve, reject) => {
          ;(async () => {
            
            const client = await pool.connect()
            try {
                
                await client.query('BEGIN');
                const queryText = 'INSERT INTO bankaccount('+column+') VALUES('+params+') RETURNING id ';
                console.log(queryText)
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
    

    
    if(query.acctype_desc){
        let acctype_desc_ = queryBuilder_string(query,"acctype_desc","acctype_desc")
        cols.push(acctype_desc_);
        vals['acctype_desc'] = query.acctype_desc;
       
    }
    if(query.acctype_desc_array){
        if(Array.isArray(query.acctype_desc_array) && query.acctype_desc_array.length>1){
            cols.push(" acctype_desc = ANY(:acctype_desc) ");
            const acctype_descString = query.acctype_desc_array.map((data) => data);
            vals['acctype_desc'] = acctype_descString;
        }
    }


    if(query.doc_status_id!=null ){
      if(!isNaN(query.doc_status_id)){
        let doc_status_id_ = queryBuilder_number(query,"doc_status_id","doc_status_id")
        cols.push(doc_status_id_);
        vals['doc_status_id'] = query.doc_status_id;
      }
    }
    if(query.doc_status_id_array){
        if(Array.isArray(query.doc_status_id_array) && query.doc_status_id_array.length==2){
            cols.push(" doc_status_id BETWEEN :doc_status_id_1 AND  :doc_status_id_2 ");
            vals['doc_status_id_1'] = query.doc_status_id_array[0]
            vals['doc_status_id_2'] = query.doc_status_id_array[1]
        }else if(Array.isArray(query.doc_status_id_array) && query.doc_status_id_array.length>2){
            cols.push(" doc_status_id = ANY(:doc_status_id) ");
            const doc_status_idString = query.doc_status_id_array.map((num) => num);
            vals['doc_status_id'] = doc_status_idString;
        }
    }


    if(query.bank_id!=null ){
      if(!isNaN(query.bank_id)){
        let bank_id_ = queryBuilder_number(query,"bank_id","bank_id")
        cols.push(bank_id_);
        vals['bank_id'] = query.bank_id;
      }
    }
    if(query.bank_id_array){
        if(Array.isArray(query.bank_id_array) && query.bank_id_array.length==2){
            cols.push(" bank_id BETWEEN :bank_id_1 AND  :bank_id_2 ");
            vals['bank_id_1'] = query.bank_id_array[0]
            vals['bank_id_2'] = query.bank_id_array[1]
        }else if(Array.isArray(query.bank_id_array) && query.bank_id_array.length>2){
            cols.push(" bank_id = ANY(:bank_id) ");
            const bank_idString = query.bank_id_array.map((num) => num);
            vals['bank_id'] = bank_idString;
        }
    }


    
    if(query.bank_name){
        let bank_name_ = queryBuilder_string(query,"bank_name","bank_name")
        cols.push(bank_name_);
        vals['bank_name'] = query.bank_name;
       
    }
    if(query.bank_name_array){
        if(Array.isArray(query.bank_name_array) && query.bank_name_array.length>1){
            cols.push(" bank_name = ANY(:bank_name) ");
            const bank_nameString = query.bank_name_array.map((data) => data);
            vals['bank_name'] = bank_nameString;
        }
    }


    
    if(query.acc_no){
        let acc_no_ = queryBuilder_string(query,"acc_no","acc_no")
        cols.push(acc_no_);
        vals['acc_no'] = query.acc_no;
       
    }
    if(query.acc_no_array){
        if(Array.isArray(query.acc_no_array) && query.acc_no_array.length>1){
            cols.push(" acc_no = ANY(:acc_no) ");
            const acc_noString = query.acc_no_array.map((data) => data);
            vals['acc_no'] = acc_noString;
        }
    }


    if(query.acctype_id!=null ){
      if(!isNaN(query.acctype_id)){
        let acctype_id_ = queryBuilder_number(query,"acctype_id","acctype_id")
        cols.push(acctype_id_);
        vals['acctype_id'] = query.acctype_id;
      }
    }
    if(query.acctype_id_array){
        if(Array.isArray(query.acctype_id_array) && query.acctype_id_array.length==2){
            cols.push(" acctype_id BETWEEN :acctype_id_1 AND  :acctype_id_2 ");
            vals['acctype_id_1'] = query.acctype_id_array[0]
            vals['acctype_id_2'] = query.acctype_id_array[1]
        }else if(Array.isArray(query.acctype_id_array) && query.acctype_id_array.length>2){
            cols.push(" acctype_id = ANY(:acctype_id) ");
            const acctype_idString = query.acctype_id_array.map((num) => num);
            vals['acctype_id'] = acctype_idString;
        }
    }


    if(query.bankinfo_id!=null ){
      if(!isNaN(query.bankinfo_id)){
        let bankinfo_id_ = queryBuilder_number(query,"bankinfo_id","bankinfo_id")
        cols.push(bankinfo_id_);
        vals['bankinfo_id'] = query.bankinfo_id;
      }
    }
    if(query.bankinfo_id_array){
        if(Array.isArray(query.bankinfo_id_array) && query.bankinfo_id_array.length==2){
            cols.push(" bankinfo_id BETWEEN :bankinfo_id_1 AND  :bankinfo_id_2 ");
            vals['bankinfo_id_1'] = query.bankinfo_id_array[0]
            vals['bankinfo_id_2'] = query.bankinfo_id_array[1]
        }else if(Array.isArray(query.bankinfo_id_array) && query.bankinfo_id_array.length>2){
            cols.push(" bankinfo_id = ANY(:bankinfo_id) ");
            const bankinfo_idString = query.bankinfo_id_array.map((num) => num);
            vals['bankinfo_id'] = bankinfo_idString;
        }
    }


    
    if(query.acc_desc){
        let acc_desc_ = queryBuilder_string(query,"acc_desc","acc_desc")
        cols.push(acc_desc_);
        vals['acc_desc'] = query.acc_desc;
       
    }
    if(query.acc_desc_array){
        if(Array.isArray(query.acc_desc_array) && query.acc_desc_array.length>1){
            cols.push(" acc_desc = ANY(:acc_desc) ");
            const acc_descString = query.acc_desc_array.map((data) => data);
            vals['acc_desc'] = acc_descString;
        }
    }


    
    if(query.bank_logo_url){
        let bank_logo_url_ = queryBuilder_string(query,"bank_logo_url","bank_logo_url")
        cols.push(bank_logo_url_);
        vals['bank_logo_url'] = query.bank_logo_url;
       
    }
    if(query.bank_logo_url_array){
        if(Array.isArray(query.bank_logo_url_array) && query.bank_logo_url_array.length>1){
            cols.push(" bank_logo_url = ANY(:bank_logo_url) ");
            const bank_logo_urlString = query.bank_logo_url_array.map((data) => data);
            vals['bank_logo_url'] = bank_logo_urlString;
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
                 
                    const queryText = 'SELECT * from bankaccount' +searchConditions+' order by '+sortBy+' '+sortDirection+' LIMIT '+perPage+' OFFSET '+offset;
                    const list = await client.query(sql(queryText)(vals));
                    const queryTextCount = 'SELECT COUNT(*) as total from bankaccount' +searchConditions
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
             
                const queryText = 'SELECT * from bankaccount' +searchConditions+'  LIMIT '+perPage;
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
    let keyConditions =` WHERE  (acctype_desc LIKe '%' || :search || '%' 
 OR bank_name LIKe '%' || :search || '%' 
 OR acc_no LIKe '%' || :search || '%' 
 OR acc_desc LIKe '%' || :search || '%' 
 OR bank_logo_url LIKe '%' || :search || '%' )`;
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
         
            const queryText = 'SELECT * from bankaccount' +searchConditions+' order by '+sortBy+' '+sortDirection+' LIMIT '+perPage;
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
      exports.patchBankaccount = (id, reqData,extraFields={}) => {
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
                             
if(body.acctype_desc!=undefined){
    cols.push("acctype_desc = :acctype_desc");
    vals['acctype_desc'] = body.acctype_desc ;  
}
                             
if(body.doc_status_id!=undefined){
    cols.push("doc_status_id = :doc_status_id");
    vals['doc_status_id'] = parseInt(body.doc_status_id) ; 
}
                             
if(body.bank_id!=undefined){
    cols.push("bank_id = :bank_id");
    vals['bank_id'] = parseInt(body.bank_id) ; 
}
                             
if(body.bank_name!=undefined){
    cols.push("bank_name = :bank_name");
    vals['bank_name'] = body.bank_name ;  
}
                             
if(body.acc_no!=undefined){
    cols.push("acc_no = :acc_no");
    vals['acc_no'] = body.acc_no ;  
}

if(body.acctype_id!=undefined){
    cols.push("acctype_id = :acctype_id");
    vals['acctype_id'] = parseFloat(body.acctype_id) ;    
}
                             
if(body.bankinfo_id!=undefined){
    cols.push("bankinfo_id = :bankinfo_id");
    vals['bankinfo_id'] = parseInt(body.bankinfo_id) ; 
}
                             
if(body.acc_desc!=undefined){
    cols.push("acc_desc = :acc_desc");
    vals['acc_desc'] = body.acc_desc ;  
}
                             
if(body.bank_logo_url!=undefined){
    cols.push("bank_logo_url = :bank_logo_url");
    vals['bank_logo_url'] = body.bank_logo_url ;  
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
              const queryText = 'UPDATE bankaccount SET '+column+'  WHERE id =:id'+searchConditions
              const updated = await client.query(sql(queryText)(vals));
              //console.log(sql(queryText)(vals))
              await client.query('COMMIT');
              //VCache.resetCache("bankaccount_list");
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
      
      exports.removeById = (bankaccountId,extraFields={}) => {
          return new Promise((resolve, reject) => {
            ;(async () => {
                const extra = queryFormatter(extraFields)
                let vals= {id:bankaccountId};
                let searchConditions=""
                if(extra.cols.length>0){
                    vals={...vals,...extra.vals};
                    searchConditions=" AND " + extra.cols.join(" AND ")
                }
                const client = await pool.connect()
                try {
                    await client.query('BEGIN')
                    const queryText = 'DELETE FROM bankaccount  WHERE  id=:id '+searchConditions
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
      
  

      exports.syncBankData = (bankLists,email) => {
        return new Promise((resolve, reject) => {
          ;(async () => {
            const client = await pool.connect()
            try {
            var time = funcs.getTime();
            for(var i=0;i<bankLists.length;i++){
                var bank =bankLists[i];
                console.log(bank.bank_name);
                var  bankExists = await this.findOne({bankinfo_id:bank.bankinfo_id})
                
                if(!bankExists){
                    bank={...bank,"createby":email,"createat":time}
                   await this.createBankaccount(bank);
                   resolve(bank);
                }
            }
             
             
            resolve({})   
                 
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
            if(req.file.size>10*1024*1024){ // you can change the file upload limit
                reject('file_size_too_big');
            }
            let colName = req.params.columnName.toLowerCase()
            let rowId = req.params.rowId
            let uploadedFileName =req.file.filename;
            let fileWithPath ="./uploads/"+ uploadedFileName;
            let data = fs.readFileSync(fileWithPath);
            let base64Data= data.toString('base64')
            let docsubmitted=false;

           
            //console.log(base64Data)
            ;(async () => {
              
                const client = await pool.connect()
                try {
             let acc_info=await this.findById(rowId,{createby:req.jwt.email})
             console.log(acc_info)
             if(acc_info){
             let newReq={...req,body:{acc_no:acc_info.acc_no,filename:uploadedFileName,file:base64Data}}
             
             //let MpaySubmit= await CasaModel.uploadBankDoc(newReq);
             console.log(MpaySubmit)
             docsubmitted=true;
              await client.query('BEGIN');
              const queryText = 'UPDATE bankaccount SET '+colName+'=:0,docsubmitted=:2  where id =:1';
              const updated = await client.query(sql(queryText)([uploadedFileName,rowId,docsubmitted]));
              //console.log(sql(queryText)(vals))

              await client.query('COMMIT');
              //VCache.resetCache("merchantinfo_list");
              resolve(uploadedFileName)
             }else{
                reject("bank account not valid")
             }
            } catch (e) {
              
                reject(e);
                
            } finally {
                client.release()
            }
            })().catch(e =>  reject(e.stack))
        });
        };