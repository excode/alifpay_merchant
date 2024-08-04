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
             
                const queryText = 'SELECT * from fundtransfer where id=:id '+searchConditions+' LIMIT 1'
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
                const queryText = 'SELECT * from fundtransfer '+condition+' LIMIT 1'
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

      exports.createFundtransfer = (body) => {
          
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

if(body.amount!=undefined){
    cols.push("amount");
    param.push(":amount");
    vals['amount'] = parseFloat(body.amount) ;  
}
                         
if(body.sourceaccount!=undefined){
    cols.push("sourceaccount");
    param.push(":sourceaccount");
    vals['sourceaccount'] = body.sourceaccount ; 
}
                         
if(body.transfer_in_reference_id!=undefined){
    cols.push("transfer_in_reference_id");
    param.push(":transfer_in_reference_id");
    vals['transfer_in_reference_id'] = body.transfer_in_reference_id ; 
}
                         
if(body.sourceaccounttokenize!=undefined){
    cols.push("sourceaccounttokenize");
    param.push(":sourceaccounttokenize");
    vals['sourceaccounttokenize'] = body.sourceaccounttokenize ; 
}
                         
if(body.transfer_out_reference_id!=undefined){
    cols.push("transfer_out_reference_id");
    param.push(":transfer_out_reference_id");
    vals['transfer_out_reference_id'] = body.transfer_out_reference_id ; 
}

if(body.servicecharges!=undefined){
    cols.push("servicecharges");
    param.push(":servicecharges");
    vals['servicecharges'] = parseFloat(body.servicecharges) ;  
}

if(body.gst!=undefined){
    cols.push("gst");
    param.push(":gst");
    vals['gst'] = parseFloat(body.gst) ;  
}
                         
if(body.destinationbankaccount!=undefined){
    cols.push("destinationbankaccount");
    param.push(":destinationbankaccount");
    vals['destinationbankaccount'] = body.destinationbankaccount ; 
}
                         
if(body.trx_date!=undefined){
    cols.push("trx_date");
    param.push(":trx_date");
    vals['trx_date'] = body.trx_date ; 
}

if(body.bankid!=undefined){
    cols.push("bankid");
    param.push(":bankid");
    vals['bankid'] = parseFloat(body.bankid) ;  
}
                      
if(body.cardpin!=undefined){
    cols.push("cardpin");
    param.push(":cardpin");
    vals['cardpin'] = parseInt(body.cardpin) ;
}
                         
if(body.reference!=undefined){
    cols.push("reference");
    param.push(":reference");
    vals['reference'] = body.reference ; 
}
    
          var column = cols.join(',');
          var params = param.join(',');
          return new Promise((resolve, reject) => {
          ;(async () => {
            
            const client = await pool.connect()
            try {
                
                await client.query('BEGIN');
                const queryText = 'INSERT INTO fundtransfer('+column+') VALUES('+params+') RETURNING id ';
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
    

    if(query.amount!=null ){
      if(!isNaN(query.amount)){
        let amount_ = queryBuilder_number(query,"amount","amount")
        cols.push(amount_);
        vals['amount'] = query.amount;
      }
    }
    if(query.amount_array){
        if(Array.isArray(query.amount_array) && query.amount_array.length==2){
            cols.push(" amount BETWEEN :amount_1 AND  :amount_2 ");
            vals['amount_1'] = query.amount_array[0]
            vals['amount_2'] = query.amount_array[1]
        }else if(Array.isArray(query.amount_array) && query.amount_array.length>2){
            cols.push(" amount = ANY(:amount) ");
            const amountString = query.amount_array.map((num) => num);
            vals['amount'] = amountString;
        }
    }


    
    if(query.sourceaccount){
        let sourceaccount_ = queryBuilder_string(query,"sourceaccount","sourceaccount")
        cols.push(sourceaccount_);
        vals['sourceaccount'] = query.sourceaccount;
       
    }
    if(query.sourceaccount_array){
        if(Array.isArray(query.sourceaccount_array) && query.sourceaccount_array.length>1){
            cols.push(" sourceaccount = ANY(:sourceaccount) ");
            const sourceaccountString = query.sourceaccount_array.map((data) => data);
            vals['sourceaccount'] = sourceaccountString;
        }
    }


    
    if(query.transfer_in_reference_id){
        let transfer_in_reference_id_ = queryBuilder_string(query,"transfer_in_reference_id","transfer_in_reference_id")
        cols.push(transfer_in_reference_id_);
        vals['transfer_in_reference_id'] = query.transfer_in_reference_id;
       
    }
    if(query.transfer_in_reference_id_array){
        if(Array.isArray(query.transfer_in_reference_id_array) && query.transfer_in_reference_id_array.length>1){
            cols.push(" transfer_in_reference_id = ANY(:transfer_in_reference_id) ");
            const transfer_in_reference_idString = query.transfer_in_reference_id_array.map((data) => data);
            vals['transfer_in_reference_id'] = transfer_in_reference_idString;
        }
    }


    
    if(query.sourceaccounttokenize){
        let sourceaccounttokenize_ = queryBuilder_string(query,"sourceaccounttokenize","sourceaccounttokenize")
        cols.push(sourceaccounttokenize_);
        vals['sourceaccounttokenize'] = query.sourceaccounttokenize;
       
    }
    if(query.sourceaccounttokenize_array){
        if(Array.isArray(query.sourceaccounttokenize_array) && query.sourceaccounttokenize_array.length>1){
            cols.push(" sourceaccounttokenize = ANY(:sourceaccounttokenize) ");
            const sourceaccounttokenizeString = query.sourceaccounttokenize_array.map((data) => data);
            vals['sourceaccounttokenize'] = sourceaccounttokenizeString;
        }
    }


    
    if(query.transfer_out_reference_id){
        let transfer_out_reference_id_ = queryBuilder_string(query,"transfer_out_reference_id","transfer_out_reference_id")
        cols.push(transfer_out_reference_id_);
        vals['transfer_out_reference_id'] = query.transfer_out_reference_id;
       
    }
    if(query.transfer_out_reference_id_array){
        if(Array.isArray(query.transfer_out_reference_id_array) && query.transfer_out_reference_id_array.length>1){
            cols.push(" transfer_out_reference_id = ANY(:transfer_out_reference_id) ");
            const transfer_out_reference_idString = query.transfer_out_reference_id_array.map((data) => data);
            vals['transfer_out_reference_id'] = transfer_out_reference_idString;
        }
    }


    if(query.servicecharges!=null ){
      if(!isNaN(query.servicecharges)){
        let servicecharges_ = queryBuilder_number(query,"servicecharges","servicecharges")
        cols.push(servicecharges_);
        vals['servicecharges'] = query.servicecharges;
      }
    }
    if(query.servicecharges_array){
        if(Array.isArray(query.servicecharges_array) && query.servicecharges_array.length==2){
            cols.push(" servicecharges BETWEEN :servicecharges_1 AND  :servicecharges_2 ");
            vals['servicecharges_1'] = query.servicecharges_array[0]
            vals['servicecharges_2'] = query.servicecharges_array[1]
        }else if(Array.isArray(query.servicecharges_array) && query.servicecharges_array.length>2){
            cols.push(" servicecharges = ANY(:servicecharges) ");
            const servicechargesString = query.servicecharges_array.map((num) => num);
            vals['servicecharges'] = servicechargesString;
        }
    }


    if(query.gst!=null ){
      if(!isNaN(query.gst)){
        let gst_ = queryBuilder_number(query,"gst","gst")
        cols.push(gst_);
        vals['gst'] = query.gst;
      }
    }
    if(query.gst_array){
        if(Array.isArray(query.gst_array) && query.gst_array.length==2){
            cols.push(" gst BETWEEN :gst_1 AND  :gst_2 ");
            vals['gst_1'] = query.gst_array[0]
            vals['gst_2'] = query.gst_array[1]
        }else if(Array.isArray(query.gst_array) && query.gst_array.length>2){
            cols.push(" gst = ANY(:gst) ");
            const gstString = query.gst_array.map((num) => num);
            vals['gst'] = gstString;
        }
    }


    
    if(query.destinationbankaccount){
        let destinationbankaccount_ = queryBuilder_string(query,"destinationbankaccount","destinationbankaccount")
        cols.push(destinationbankaccount_);
        vals['destinationbankaccount'] = query.destinationbankaccount;
       
    }
    if(query.destinationbankaccount_array){
        if(Array.isArray(query.destinationbankaccount_array) && query.destinationbankaccount_array.length>1){
            cols.push(" destinationbankaccount = ANY(:destinationbankaccount) ");
            const destinationbankaccountString = query.destinationbankaccount_array.map((data) => data);
            vals['destinationbankaccount'] = destinationbankaccountString;
        }
    }


        if(query.trx_date){
            let trx_date_ = queryBuilder_date(query,"trx_date","trx_date")
            cols.push(trx_date_);
            vals['trx_date'] = query.trx_date;   
        }
        if(query.trx_date_array){
            if(Array.isArray(query.trx_date_array) && query.trx_date_array.length==2){
                cols.push(" trx_date BETWEEN :trx_date_1 AND  :trx_date_2 ");
                vals['trx_date_1'] = new Date(query.trx_date_array[0])
                vals['trx_date_2'] = new Date(query.trx_date_array[1])
            }else if(Array.isArray(query.trx_date_array) && query.trx_date_array.length>2){
                cols.push(" trx_date = ANY(:trx_date::date[]) ");
                const trx_dateString = query.trx_date_array.map((date) => date);
                vals['trx_date'] = trx_dateString;
            }
        }
    

    if(query.bankid!=null ){
      if(!isNaN(query.bankid)){
        let bankid_ = queryBuilder_number(query,"bankid","bankid")
        cols.push(bankid_);
        vals['bankid'] = query.bankid;
      }
    }
    if(query.bankid_array){
        if(Array.isArray(query.bankid_array) && query.bankid_array.length==2){
            cols.push(" bankid BETWEEN :bankid_1 AND  :bankid_2 ");
            vals['bankid_1'] = query.bankid_array[0]
            vals['bankid_2'] = query.bankid_array[1]
        }else if(Array.isArray(query.bankid_array) && query.bankid_array.length>2){
            cols.push(" bankid = ANY(:bankid) ");
            const bankidString = query.bankid_array.map((num) => num);
            vals['bankid'] = bankidString;
        }
    }


    if(query.cardpin!=null ){
      if(!isNaN(query.cardpin)){
        let cardpin_ = queryBuilder_number(query,"cardpin","cardpin")
        cols.push(cardpin_);
        vals['cardpin'] = query.cardpin;
      }
    }
    if(query.cardpin_array){
        if(Array.isArray(query.cardpin_array) && query.cardpin_array.length==2){
            cols.push(" cardpin BETWEEN :cardpin_1 AND  :cardpin_2 ");
            vals['cardpin_1'] = query.cardpin_array[0]
            vals['cardpin_2'] = query.cardpin_array[1]
        }else if(Array.isArray(query.cardpin_array) && query.cardpin_array.length>2){
            cols.push(" cardpin = ANY(:cardpin) ");
            const cardpinString = query.cardpin_array.map((num) => num);
            vals['cardpin'] = cardpinString;
        }
    }


    
    if(query.reference){
        let reference_ = queryBuilder_string(query,"reference","reference")
        cols.push(reference_);
        vals['reference'] = query.reference;
       
    }
    if(query.reference_array){
        if(Array.isArray(query.reference_array) && query.reference_array.length>1){
            cols.push(" reference = ANY(:reference) ");
            const referenceString = query.reference_array.map((data) => data);
            vals['reference'] = referenceString;
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
                 
                    const queryText = 'SELECT * from fundtransfer' +searchConditions+' order by '+sortBy+' '+sortDirection+' LIMIT '+perPage+' OFFSET '+offset;
                    const list = await client.query(sql(queryText)(vals));
                    const queryTextCount = 'SELECT COUNT(*) as total from fundtransfer' +searchConditions
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
             
                const queryText = 'SELECT * from fundtransfer' +searchConditions+'  LIMIT '+perPage;
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
    let keyConditions =` WHERE  (sourceaccount LIKe '%' || :search || '%' 
 OR transfer_in_reference_id LIKe '%' || :search || '%' 
 OR sourceaccounttokenize LIKe '%' || :search || '%' 
 OR transfer_out_reference_id LIKe '%' || :search || '%' 
 OR destinationbankaccount LIKe '%' || :search || '%' 
 OR reference LIKe '%' || :search || '%' )`;
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
         
            const queryText = 'SELECT * from fundtransfer' +searchConditions+' order by '+sortBy+' '+sortDirection+' LIMIT '+perPage;
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
      exports.patchFundtransfer = (id, reqData,extraFields={}) => {
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

if(body.amount!=undefined){
    cols.push("amount = :amount");
    vals['amount'] = parseFloat(body.amount) ;    
}
                             
if(body.sourceaccount!=undefined){
    cols.push("sourceaccount = :sourceaccount");
    vals['sourceaccount'] = body.sourceaccount ;  
}
                             
if(body.transfer_in_reference_id!=undefined){
    cols.push("transfer_in_reference_id = :transfer_in_reference_id");
    vals['transfer_in_reference_id'] = body.transfer_in_reference_id ;  
}
                             
if(body.sourceaccounttokenize!=undefined){
    cols.push("sourceaccounttokenize = :sourceaccounttokenize");
    vals['sourceaccounttokenize'] = body.sourceaccounttokenize ;  
}
                             
if(body.transfer_out_reference_id!=undefined){
    cols.push("transfer_out_reference_id = :transfer_out_reference_id");
    vals['transfer_out_reference_id'] = body.transfer_out_reference_id ;  
}

if(body.servicecharges!=undefined){
    cols.push("servicecharges = :servicecharges");
    vals['servicecharges'] = parseFloat(body.servicecharges) ;    
}

if(body.gst!=undefined){
    cols.push("gst = :gst");
    vals['gst'] = parseFloat(body.gst) ;    
}
                             
if(body.destinationbankaccount!=undefined){
    cols.push("destinationbankaccount = :destinationbankaccount");
    vals['destinationbankaccount'] = body.destinationbankaccount ;  
}
                             
if(body.trx_date!=undefined){
    cols.push("trx_date = :trx_date");
    vals['trx_date'] = body.trx_date ;  
}

if(body.bankid!=undefined){
    cols.push("bankid = :bankid");
    vals['bankid'] = parseFloat(body.bankid) ;    
}
                             
if(body.cardpin!=undefined){
    cols.push("cardpin = :cardpin");
    vals['cardpin'] = parseInt(body.cardpin) ; 
}
                             
if(body.reference!=undefined){
    cols.push("reference = :reference");
    vals['reference'] = body.reference ;  
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
              const queryText = 'UPDATE fundtransfer SET '+column+'  WHERE id =:id'+searchConditions
              const updated = await client.query(sql(queryText)(vals));
              //console.log(sql(queryText)(vals))
              await client.query('COMMIT');
              //VCache.resetCache("fundtransfer_list");
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
      
      exports.removeById = (fundtransferId,extraFields={}) => {
          return new Promise((resolve, reject) => {
            ;(async () => {
                const extra = queryFormatter(extraFields)
                let vals= {id:fundtransferId};
                let searchConditions=""
                if(extra.cols.length>0){
                    vals={...vals,...extra.vals};
                    searchConditions=" AND " + extra.cols.join(" AND ")
                }
                const client = await pool.connect()
                try {
                    await client.query('BEGIN')
                    const queryText = 'DELETE FROM fundtransfer  WHERE  id=:id '+searchConditions
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
      
  
      exports.summary = (querys={} ) => {
        const perPage =300;//LIMIT
        
        const {cols,vals} = queryFormatter(querys)
        var searchConditions=cols.length>0?" WHERE "+cols.join(" AND ") :"" 
        return new Promise((resolve, reject) => {
        ;(async () => {
       
            const client = await pool.connect()
            try {
             
                const queryText = 'select sum(amount) as total,count(id) num from fundtransfer ' +searchConditions+'  LIMIT '+perPage;
                const list = await client.query(sql(queryText)(vals));
                
               resolve( list.rows[0]);
               
            } catch (e) {
              
               // throw e
                reject(e);
            } finally {
                client.release()
            }
            })().catch(e =>  reject(e.stack))
        });
       
  };