const pool = require("../db");
    const VCache = require('../../lib/cache');
    const funcs =  require("../../common/functions/funcs");
    const crypto = require('crypto');
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
             
                const queryText = 'SELECT * from mpaycard where id=:id '+searchConditions+' LIMIT 1'
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
                const queryText = 'SELECT * from mpaycard '+condition+' LIMIT 1'
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

      exports.createMpaycard = (body) => {
          
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
                         
if(body.alifpayusername!=undefined){
    cols.push("alifpayusername");
    param.push(":alifpayusername");
    vals['alifpayusername'] = body.alifpayusername ; 
}
                      
if(body.uid!=undefined){
    cols.push("uid");
    param.push(":uid");
    vals['uid'] = parseInt(body.uid) ;
}
                         
if(body.cardtoken!=undefined){
    cols.push("cardtoken");
    param.push(":cardtoken");
    vals['cardtoken'] = body.cardtoken ; 
}
                         
if(body.cardtypeid!=undefined){
    cols.push("cardtypeid");
    param.push(":cardtypeid");
    vals['cardtypeid'] = body.cardtypeid ; 
}
                         
if(body.cardtype!=undefined){
    cols.push("cardtype");
    param.push(":cardtype");
    vals['cardtype'] = body.cardtype ; 
}
                      
if(body.cardid!=undefined){
    cols.push("cardid");
    param.push(":cardid");
    vals['cardid'] = parseInt(body.cardid) ;
}
                         
if(body.maskcardno!=undefined){
    cols.push("maskcardno");
    param.push(":maskcardno");
    vals['maskcardno'] = body.maskcardno ; 
}
                         
if(body.cardgroup!=undefined){
    cols.push("cardgroup");
    param.push(":cardgroup");
    vals['cardgroup'] = body.cardgroup ; 
}
                         
if(body.status!=undefined){
    cols.push("status");
    param.push(":status");
    vals['status'] = body.status ; 
}
                         
if(body.cardtemporarypin!=undefined){
    cols.push("cardtemporarypin");
    param.push(":cardtemporarypin");
    vals['cardtemporarypin'] = body.cardtemporarypin ; 
}
    
          var column = cols.join(',');
          var params = param.join(',');
          return new Promise((resolve, reject) => {
          ;(async () => {
            
            const client = await pool.connect()
            try {
                
                await client.query('BEGIN');
                const queryText = 'INSERT INTO mpaycard('+column+') VALUES('+params+') RETURNING id ';
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
    

    
    if(query.alifpayusername){
        let alifpayusername_ = queryBuilder_string(query,"alifpayusername","alifpayusername")
        cols.push(alifpayusername_);
        vals['alifpayusername'] = query.alifpayusername;
       
    }
    if(query.alifpayusername_array){
        if(Array.isArray(query.alifpayusername_array) && query.alifpayusername_array.length>1){
            cols.push(" alifpayusername = ANY(:alifpayusername) ");
            const alifpayusernameString = query.alifpayusername_array.map((data) => data);
            vals['alifpayusername'] = alifpayusernameString;
        }
    }


    if(query.uid!=null ){
      if(!isNaN(query.uid)){
        let uid_ = queryBuilder_number(query,"uid","uid")
        cols.push(uid_);
        vals['uid'] = query.uid;
      }
    }
    if(query.uid_array){
        if(Array.isArray(query.uid_array) && query.uid_array.length==2){
            cols.push(" uid BETWEEN :uid_1 AND  :uid_2 ");
            vals['uid_1'] = query.uid_array[0]
            vals['uid_2'] = query.uid_array[1]
        }else if(Array.isArray(query.uid_array) && query.uid_array.length>2){
            cols.push(" uid = ANY(:uid) ");
            const uidString = query.uid_array.map((num) => num);
            vals['uid'] = uidString;
        }
    }


    
    if(query.cardtoken){
        let cardtoken_ = queryBuilder_string(query,"cardtoken","cardtoken")
        cols.push(cardtoken_);
        vals['cardtoken'] = query.cardtoken;
       
    }
    if(query.cardtoken_array){
        if(Array.isArray(query.cardtoken_array) && query.cardtoken_array.length>1){
            cols.push(" cardtoken = ANY(:cardtoken) ");
            const cardtokenString = query.cardtoken_array.map((data) => data);
            vals['cardtoken'] = cardtokenString;
        }
    }


    
    if(query.cardtypeid){
        let cardtypeid_ = queryBuilder_string(query,"cardtypeid","cardtypeid")
        cols.push(cardtypeid_);
        vals['cardtypeid'] = query.cardtypeid;
       
    }
    if(query.cardtypeid_array){
        if(Array.isArray(query.cardtypeid_array) && query.cardtypeid_array.length>1){
            cols.push(" cardtypeid = ANY(:cardtypeid) ");
            const cardtypeidString = query.cardtypeid_array.map((data) => data);
            vals['cardtypeid'] = cardtypeidString;
        }
    }


    if(query.cardid!=null ){
      if(!isNaN(query.cardid)){
        let cardid_ = queryBuilder_number(query,"cardid","cardid")
        cols.push(cardid_);
        vals['cardid'] = query.cardid;
      }
    }
    if(query.cardid_array){
        if(Array.isArray(query.cardid_array) && query.cardid_array.length==2){
            cols.push(" cardid BETWEEN :cardid_1 AND  :cardid_2 ");
            vals['cardid_1'] = query.cardid_array[0]
            vals['cardid_2'] = query.cardid_array[1]
        }else if(Array.isArray(query.cardid_array) && query.cardid_array.length>2){
            cols.push(" cardid = ANY(:cardid) ");
            const cardidString = query.cardid_array.map((num) => num);
            vals['cardid'] = cardidString;
        }
    }


    
    if(query.maskcardno){
        let maskcardno_ = queryBuilder_string(query,"maskcardno","maskcardno")
        cols.push(maskcardno_);
        vals['maskcardno'] = query.maskcardno;
       
    }
    if(query.maskcardno_array){
        if(Array.isArray(query.maskcardno_array) && query.maskcardno_array.length>1){
            cols.push(" maskcardno = ANY(:maskcardno) ");
            const maskcardnoString = query.maskcardno_array.map((data) => data);
            vals['maskcardno'] = maskcardnoString;
        }
    }


    
    if(query.cardgroup){
        let cardgroup_ = queryBuilder_string(query,"cardgroup","cardgroup")
        cols.push(cardgroup_);
        vals['cardgroup'] = query.cardgroup;
       
    }
    if(query.cardgroup_array){
        if(Array.isArray(query.cardgroup_array) && query.cardgroup_array.length>1){
            cols.push(" cardgroup = ANY(:cardgroup) ");
            const cardgroupString = query.cardgroup_array.map((data) => data);
            vals['cardgroup'] = cardgroupString;
        }
    }


    
    if(query.cardtemporarypin){
        let cardtemporarypin_ = queryBuilder_string(query,"cardtemporarypin","cardtemporarypin")
        cols.push(cardtemporarypin_);
        vals['cardtemporarypin'] = query.cardtemporarypin;
       
    }
    if(query.cardtemporarypin_array){
        if(Array.isArray(query.cardtemporarypin_array) && query.cardtemporarypin_array.length>1){
            cols.push(" cardtemporarypin = ANY(:cardtemporarypin) ");
            const cardtemporarypinString = query.cardtemporarypin_array.map((data) => data);
            vals['cardtemporarypin'] = cardtemporarypinString;
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
                 
                    const queryText = 'SELECT * from mpaycard' +searchConditions+' order by '+sortBy+' '+sortDirection+' LIMIT '+perPage+' OFFSET '+offset;
                    const list = await client.query(sql(queryText)(vals));
                    const queryTextCount = 'SELECT COUNT(*) as total from mpaycard' +searchConditions
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
             
                const queryText = 'SELECT * from mpaycard' +searchConditions+'  LIMIT '+perPage;
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
    let keyConditions =` WHERE  (alifpayusername LIKe '%' || :search || '%' )`;
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
         
            const queryText = 'SELECT * from mpaycard' +searchConditions+' order by '+sortBy+' '+sortDirection+' LIMIT '+perPage;
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
      exports.patchMpaycard = (id, reqData,extraFields={}) => {
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
                             
if(body.alifpayusername!=undefined){
    cols.push("alifpayusername = :alifpayusername");
    vals['alifpayusername'] = body.alifpayusername ;  
}
                             
if(body.uid!=undefined){
    cols.push("uid = :uid");
    vals['uid'] = parseInt(body.uid) ; 
}
                             
if(body.cardtoken!=undefined){
    cols.push("cardtoken = :cardtoken");
    vals['cardtoken'] = body.cardtoken ;  
}
                             
if(body.cardtypeid!=undefined){
    cols.push("cardtypeid = :cardtypeid");
    vals['cardtypeid'] = body.cardtypeid ;  
}
                             
if(body.cardtype!=undefined){
    cols.push("cardtype = :cardtype");
    vals['cardtype'] = body.cardtype ;  
}
                             
if(body.cardid!=undefined){
    cols.push("cardid = :cardid");
    vals['cardid'] = parseInt(body.cardid) ; 
}
                             
if(body.maskcardno!=undefined){
    cols.push("maskcardno = :maskcardno");
    vals['maskcardno'] = body.maskcardno ;  
}
                             
if(body.cardgroup!=undefined){
    cols.push("cardgroup = :cardgroup");
    vals['cardgroup'] = body.cardgroup ;  
}
                             
if(body.status!=undefined){
    cols.push("status = :status");
    vals['status'] = body.status ;  
}
                             
if(body.cardtemporarypin!=undefined){
    cols.push("cardtemporarypin = :cardtemporarypin");
    vals['cardtemporarypin'] = body.cardtemporarypin ;  
}
if(body.vcardurl!=undefined){
    cols.push("vcardurl = :vcardurl");
    vals['vcardurl'] = body.vcardurl ;  
}
if(body.vcardurl_gen_date!=undefined){
    cols.push("vcardurl_gen_date = :vcardurl_gen_date");
    vals['vcardurl_gen_date'] = body.vcardurl_gen_date ;  
}
//virtual_card_link

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
              const queryText = 'UPDATE mpaycard SET '+column+'  WHERE id =:id'+searchConditions
              const updated = await client.query(sql(queryText)(vals));
              //console.log(sql(queryText)(vals))
              await client.query('COMMIT');
              //VCache.resetCache("mpaycard_list");
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
      
      exports.removeById = (mpaycardId,extraFields={}) => {
          return new Promise((resolve, reject) => {
            ;(async () => {
                const extra = queryFormatter(extraFields)
                let vals= {id:mpaycardId};
                let searchConditions=""
                if(extra.cols.length>0){
                    vals={...vals,...extra.vals};
                    searchConditions=" AND " + extra.cols.join(" AND ")
                }
                const client = await pool.connect()
                try {
                    await client.query('BEGIN')
                    const queryText = 'DELETE FROM mpaycard  WHERE  id=:id '+searchConditions
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
      
  