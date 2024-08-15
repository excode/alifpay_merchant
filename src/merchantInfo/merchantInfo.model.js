const pool = require("../db");
const VCache = require('../../lib/cache');
const funcs =  require("../../common/functions/funcs");
const {queryFormatter,queryBuilder_string,
        queryBuilder_number,
        queryBuilder_date} = require("../../common/functions/queryutilPostgre")
var sql = require('yesql').pg
const otp =  require("../../common/functions/otp");
const AccountModel =require("../../src/accounts/accounts.model");
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
             
                const queryText = 'SELECT * from merchantinfo where id=:id '+searchConditions+' LIMIT 1'
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
                const queryText = 'SELECT * from merchantinfo '+condition+' LIMIT 1'
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

exports.findByMobileno = (mobileno) => {
    return new Promise((resolve, reject) => {
    ;(async () => {
        
        const client = await pool.connect()
        try {
            
            const queryText = 'SELECT * from merchantinfo where mobileno=:mobileno LIMIT 1'
            const list = await client.query(sql(queryText)({mobileno:mobileno}))
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
            
            const queryText = 'SELECT * from merchantinfo where email=:email LIMIT 1'
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
    exports.findByEmail2 = (email) => {
        return new Promise((resolve, reject) => {
        ;(async () => {
            
            const client = await pool.connect()
            try {
                
                const queryText = 'SELECT * from merchantinfo where createby=:email LIMIT 1'
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
        
      exports.createMerchantInfo = async(body) => {
          
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
                         
if(body.contactperson!=undefined){
    cols.push("contactperson");
    param.push(":contactperson");
    vals['contactperson'] = body.contactperson ; 
}
                         
if(body.mobileno!=undefined){
    cols.push("mobileno");
    param.push(":mobileno");
    vals['mobileno'] = body.mobileno ; 
}
                         
if(body.email!=undefined){
    cols.push("email");
    param.push(":email");
    vals['email'] = body.email ; 
}
                         
if(body.street!=undefined){
    cols.push("street");
    param.push(":street");
    vals['street'] = body.street ; 
}
                         
if(body.address!=undefined){
    cols.push("address");
    param.push(":address");
    vals['address'] = body.address ; 
}
                         
if(body.city!=undefined){
    cols.push("city");
    param.push(":city");
    vals['city'] = body.city ; 
}
                         
if(body.state!=undefined){
    cols.push("state");
    param.push(":state");
    vals['state'] = body.state ; 
}
                         
if(body.postcode!=undefined){
    cols.push("postcode");
    param.push(":postcode");
    vals['postcode'] = body.postcode ; 
}
                         
if(body.country!=undefined){
    cols.push("country");
    param.push(":country");
    vals['country'] = body.country ; 
}

if(body.avgtransaction!=undefined){
    cols.push("avgtransaction");
    param.push(":avgtransaction");
    vals['avgtransaction'] = parseFloat(body.avgtransaction) ;  
}

if(body.avgmonthlytransaction!=undefined){
    cols.push("avgmonthlytransaction");
    param.push(":avgmonthlytransaction");
    vals['avgmonthlytransaction'] = parseFloat(body.avgmonthlytransaction) ;  
}
                         
if(body.bankstatement!=undefined){
    cols.push("bankstatement");
    param.push(":bankstatement");
    vals['bankstatement'] = body.bankstatement ; 
}
                         
if(body.ssm!=undefined){
    cols.push("ssm");
    param.push(":ssm");
    vals['ssm'] = body.ssm ; 
}
                         
if(body.authorizationform!=undefined){
    cols.push("authorizationform");
    param.push(":authorizationform");
    vals['authorizationform'] = body.authorizationform ; 
}
                         
if(body.signboard!=undefined){
    cols.push("signboard");
    param.push(":signboard");
    vals['signboard'] = body.signboard ; 
}
                         
if(body.storeleftphoto!=undefined){
    cols.push("storeleftphoto");
    param.push(":storeleftphoto");
    vals['storeleftphoto'] = body.storeleftphoto ; 
}
                         
if(body.storerightphoto!=undefined){
    cols.push("storerightphoto");
    param.push(":storerightphoto");
    vals['storerightphoto'] = body.storerightphoto ; 
}
                         
if(body.workstation!=undefined){
    cols.push("workstation");
    param.push(":workstation");
    vals['workstation'] = body.workstation ; 
}
                         
if(body.productphoto1!=undefined){
    cols.push("productphoto1");
    param.push(":productphoto1");
    vals['productphoto1'] = body.productphoto1 ; 
}
                         
if(body.productphoto2!=undefined){
    cols.push("productphoto2");
    param.push(":productphoto2");
    vals['productphoto2'] = body.productphoto2 ; 
}
                         
if(body.productphoto3!=undefined){
    cols.push("productphoto3");
    param.push(":productphoto3");
    vals['productphoto3'] = body.productphoto3 ; 
}
if(body.introducer!=undefined){
    cols.push("introducer");
    param.push(":introducer");
    vals['introducer'] = body.introducer ; 
}
    
          var column = cols.join(',');
          var params = param.join(',');
          return new Promise((resolve, reject) => {
          ;(async () => {
            
            const client = await pool.connect()
            try {
        let introducerInfo =await AccountModel.findByUsername(body.introducer);


        if(introducerInfo) {
            if(introducerInfo["acctype"]=="MERCHANT"){
                let myInfo =await AccountModel.findByUsername(body.username);
                const my_uid= parseInt(myInfo["uid"])
                const intro_uid= parseInt(introducerInfo["uid"])
                if(intro_uid>my_uid){
                    reject("Invalid introducer: The introducer must be an existing member who joined before the referred individual.");
                    return;
                }

            }else{
                reject("Invalid introducer, Introducer must be merchant");
                return;
            }
            
        }else{
            reject("Invalid introducer");
            return;
        }
        let   createbyCHeck =await this.findOne({"createby":body.createby})
        if(createbyCHeck ) {
            reject("Only one merchant per user");
            return;
        }
        let   mobilenoCHeck =await this.findOne({"mobileno":body.mobileno})
          if(mobilenoCHeck ) {
            reject("mobileno exists");
            return;
          }
        
        let   emailCHeck =await this.findOne({"email":body.email})
          if(emailCHeck ) {
            reject("email exists");
            return;
          }
        
                await client.query('BEGIN');
                const queryText = 'INSERT INTO merchantinfo('+column+') VALUES('+params+') RETURNING id ';
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
    

    
    if(query.contactperson){
        let contactperson_ = queryBuilder_string(query,"contactperson","contactperson")
        cols.push(contactperson_);
        vals['contactperson'] = query.contactperson;
       
    }
    if(query.contactperson_array){
        if(Array.isArray(query.contactperson_array) && query.contactperson_array.length>1){
            cols.push(" contactperson = ANY(:contactperson) ");
            const contactpersonString = query.contactperson_array.map((data) => data);
            vals['contactperson'] = contactpersonString;
        }
    }


    
    if(query.mobileno){
        let mobileno_ = queryBuilder_string(query,"mobileno","mobileno")
        cols.push(mobileno_);
        vals['mobileno'] = query.mobileno;
       
    }
    if(query.mobileno_array){
        if(Array.isArray(query.mobileno_array) && query.mobileno_array.length>1){
            cols.push(" mobileno = ANY(:mobileno) ");
            const mobilenoString = query.mobileno_array.map((data) => data);
            vals['mobileno'] = mobilenoString;
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


    
    if(query.street){
        let street_ = queryBuilder_string(query,"street","street")
        cols.push(street_);
        vals['street'] = query.street;
       
    }
    if(query.street_array){
        if(Array.isArray(query.street_array) && query.street_array.length>1){
            cols.push(" street = ANY(:street) ");
            const streetString = query.street_array.map((data) => data);
            vals['street'] = streetString;
        }
    }


    
    if(query.address){
        let address_ = queryBuilder_string(query,"address","address")
        cols.push(address_);
        vals['address'] = query.address;
       
    }
    if(query.address_array){
        if(Array.isArray(query.address_array) && query.address_array.length>1){
            cols.push(" address = ANY(:address) ");
            const addressString = query.address_array.map((data) => data);
            vals['address'] = addressString;
        }
    }


    
    if(query.city){
        let city_ = queryBuilder_string(query,"city","city")
        cols.push(city_);
        vals['city'] = query.city;
       
    }
    if(query.city_array){
        if(Array.isArray(query.city_array) && query.city_array.length>1){
            cols.push(" city = ANY(:city) ");
            const cityString = query.city_array.map((data) => data);
            vals['city'] = cityString;
        }
    }


    
    if(query.state){
        let state_ = queryBuilder_string(query,"state","state")
        cols.push(state_);
        vals['state'] = query.state;
       
    }
    if(query.state_array){
        if(Array.isArray(query.state_array) && query.state_array.length>1){
            cols.push(" state = ANY(:state) ");
            const stateString = query.state_array.map((data) => data);
            vals['state'] = stateString;
        }
    }


    
    if(query.postcode){
        let postcode_ = queryBuilder_string(query,"postcode","postcode")
        cols.push(postcode_);
        vals['postcode'] = query.postcode;
       
    }
    if(query.postcode_array){
        if(Array.isArray(query.postcode_array) && query.postcode_array.length>1){
            cols.push(" postcode = ANY(:postcode) ");
            const postcodeString = query.postcode_array.map((data) => data);
            vals['postcode'] = postcodeString;
        }
    }


    
    if(query.country){
        let country_ = queryBuilder_string(query,"country","country")
        cols.push(country_);
        vals['country'] = query.country;
       
    }
    if(query.country_array){
        if(Array.isArray(query.country_array) && query.country_array.length>1){
            cols.push(" country = ANY(:country) ");
            const countryString = query.country_array.map((data) => data);
            vals['country'] = countryString;
        }
    }


    if(query.avgtransaction!=null ){
      if(!isNaN(query.avgtransaction)){
        let avgtransaction_ = queryBuilder_number(query,"avgtransaction","avgtransaction")
        cols.push(avgtransaction_);
        vals['avgtransaction'] = query.avgtransaction;
      }
    }
    if(query.avgtransaction_array){
        if(Array.isArray(query.avgtransaction_array) && query.avgtransaction_array.length==2){
            cols.push(" avgtransaction BETWEEN :avgtransaction_1 AND  :avgtransaction_2 ");
            vals['avgtransaction_1'] = query.avgtransaction_array[0]
            vals['avgtransaction_2'] = query.avgtransaction_array[1]
        }else if(Array.isArray(query.avgtransaction_array) && query.avgtransaction_array.length>2){
            cols.push(" avgtransaction = ANY(:avgtransaction) ");
            const avgtransactionString = query.avgtransaction_array.map((num) => num);
            vals['avgtransaction'] = avgtransactionString;
        }
    }


    if(query.avgmonthlytransaction!=null ){
      if(!isNaN(query.avgmonthlytransaction)){
        let avgmonthlytransaction_ = queryBuilder_number(query,"avgmonthlytransaction","avgmonthlytransaction")
        cols.push(avgmonthlytransaction_);
        vals['avgmonthlytransaction'] = query.avgmonthlytransaction;
      }
    }
    if(query.avgmonthlytransaction_array){
        if(Array.isArray(query.avgmonthlytransaction_array) && query.avgmonthlytransaction_array.length==2){
            cols.push(" avgmonthlytransaction BETWEEN :avgmonthlytransaction_1 AND  :avgmonthlytransaction_2 ");
            vals['avgmonthlytransaction_1'] = query.avgmonthlytransaction_array[0]
            vals['avgmonthlytransaction_2'] = query.avgmonthlytransaction_array[1]
        }else if(Array.isArray(query.avgmonthlytransaction_array) && query.avgmonthlytransaction_array.length>2){
            cols.push(" avgmonthlytransaction = ANY(:avgmonthlytransaction) ");
            const avgmonthlytransactionString = query.avgmonthlytransaction_array.map((num) => num);
            vals['avgmonthlytransaction'] = avgmonthlytransactionString;
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
                 
                    const queryText = 'SELECT * from merchantinfo' +searchConditions+' order by '+sortBy+' '+sortDirection+' LIMIT '+perPage+' OFFSET '+offset;
                    const list = await client.query(sql(queryText)(vals));
                    const queryTextCount = 'SELECT COUNT(*) as total from merchantinfo' +searchConditions
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
             
                const queryText = 'SELECT * from merchantinfo' +searchConditions+'  LIMIT '+perPage;
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
    let keyConditions =` WHERE  (contactperson LIKe '%' || :search || '%' 
 OR mobileno LIKe '%' || :search || '%' 
 OR email LIKe '%' || :search || '%' 
 OR street LIKe '%' || :search || '%' 
 OR address LIKe '%' || :search || '%' 
 OR city LIKe '%' || :search || '%' 
 OR state LIKe '%' || :search || '%' 
 OR postcode LIKe '%' || :search || '%' 
 OR country LIKe '%' || :search || '%' )`;
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
         
            const queryText = 'SELECT * from merchantinfo' +searchConditions+' order by '+sortBy+' '+sortDirection+' LIMIT '+perPage;
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
      exports.patchMerchantInfo = async(id, reqData,extraFields={}) => {
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
                             
if(body.contactperson!=undefined){
    cols.push("contactperson = :contactperson");
    vals['contactperson'] = body.contactperson ;  
}
                             
if(body.mobileno!=undefined){
    cols.push("mobileno = :mobileno");
    vals['mobileno'] = body.mobileno ;  
}
                             
if(body.email!=undefined){
    cols.push("email = :email");
    vals['email'] = body.email ;  
}
                             
if(body.street!=undefined){
    cols.push("street = :street");
    vals['street'] = body.street ;  
}
                             
if(body.address!=undefined){
    cols.push("address = :address");
    vals['address'] = body.address ;  
}
                             
if(body.city!=undefined){
    cols.push("city = :city");
    vals['city'] = body.city ;  
}
                             
if(body.state!=undefined){
    cols.push("state = :state");
    vals['state'] = body.state ;  
}
                             
if(body.postcode!=undefined){
    cols.push("postcode = :postcode");
    vals['postcode'] = body.postcode ;  
}
                             
if(body.country!=undefined){
    cols.push("country = :country");
    vals['country'] = body.country ;  
}

if(body.avgtransaction!=undefined){
    cols.push("avgtransaction = :avgtransaction");
    vals['avgtransaction'] = parseFloat(body.avgtransaction) ;    
}

if(body.avgmonthlytransaction!=undefined){
    cols.push("avgmonthlytransaction = :avgmonthlytransaction");
    vals['avgmonthlytransaction'] = parseFloat(body.avgmonthlytransaction) ;    
}
                             
if(body.bankstatement!=undefined){
    cols.push("bankstatement = :bankstatement");
    vals['bankstatement'] = body.bankstatement ;  
}
                             
if(body.ssm!=undefined){
    cols.push("ssm = :ssm");
    vals['ssm'] = body.ssm ;  
}
                             
if(body.authorizationform!=undefined){
    cols.push("authorizationform = :authorizationform");
    vals['authorizationform'] = body.authorizationform ;  
}
                             
if(body.signboard!=undefined){
    cols.push("signboard = :signboard");
    vals['signboard'] = body.signboard ;  
}
                             
if(body.storeleftphoto!=undefined){
    cols.push("storeleftphoto = :storeleftphoto");
    vals['storeleftphoto'] = body.storeleftphoto ;  
}
                             
if(body.storerightphoto!=undefined){
    cols.push("storerightphoto = :storerightphoto");
    vals['storerightphoto'] = body.storerightphoto ;  
}
                             
if(body.workstation!=undefined){
    cols.push("workstation = :workstation");
    vals['workstation'] = body.workstation ;  
}
                             
if(body.productphoto1!=undefined){
    cols.push("productphoto1 = :productphoto1");
    vals['productphoto1'] = body.productphoto1 ;  
}
                             
if(body.productphoto2!=undefined){
    cols.push("productphoto2 = :productphoto2");
    vals['productphoto2'] = body.productphoto2 ;  
}
                             
if(body.productphoto3!=undefined){
    cols.push("productphoto3 = :productphoto3");
    vals['productphoto3'] = body.productphoto3 ;  
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
             
        if(body.mobileno!=undefined){
        let   mobilenoCHeck =await this.findOne({id:{ne:id},"mobileno":body.mobileno})
          if(mobilenoCHeck ) {
            reject("mobileno exists");
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
        
              await client.query('BEGIN');
              const queryText = 'UPDATE merchantinfo SET '+column+'  WHERE id =:id'+searchConditions
              const updated = await client.query(sql(queryText)(vals));
              //console.log(sql(queryText)(vals))
              await client.query('COMMIT');
              //VCache.resetCache("merchantinfo_list");
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
      
      exports.removeById = (merchantinfoId,extraFields={}) => {
          return new Promise((resolve, reject) => {
            ;(async () => {
                const extra = queryFormatter(extraFields)
                let vals= {id:merchantinfoId};
                let searchConditions=""
                if(extra.cols.length>0){
                    vals={...vals,...extra.vals};
                    searchConditions=" AND " + extra.cols.join(" AND ")
                }
                const client = await pool.connect()
                try {
                    await client.query('BEGIN')
                    const queryText = 'DELETE FROM merchantinfo  WHERE  id=:id '+searchConditions
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
              const queryText = 'UPDATE merchantinfo SET '+colName+'=:0  where id =:1';
              const updated = await client.query(sql(queryText)([uploadedFileName,rowId]));
              //console.log(sql(queryText)(vals))
              await client.query('COMMIT');
              //VCache.resetCache("merchantinfo_list");
              resolve(uploadedFileName)
            } catch (e) {
              
                reject(e);
                
            } finally {
                client.release()
            }
            })().catch(e =>  reject(e.stack))
        });
        };
        
  

exports.sendApplication=(req)=>{
    console.log("XXXX")
    return new Promise(async(resolve, reject) => {
    
    //console.log("AAAAA")
    ///console.log(req.jwt)
          let content=   await otp.sendMerchantApplication(req)
          resolve(content)
        });
   
}