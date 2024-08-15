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
             
                const queryText = 'SELECT * from accounts where id=:id '+searchConditions+' LIMIT 1'
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
        console.log(querys)
        const {cols,vals} = queryFormatter(querys)
        
        var condition=cols.length>0?" WHERE "+cols.join(" AND ") :""
        return new Promise((resolve, reject) => {
        ;(async () => {
           
            const client = await pool.connect()
            try {
                const queryText = 'SELECT * from accounts '+condition+' LIMIT 1'
                console.log(sql(queryText)(vals))
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

exports.findByUsername = (username) => {
    return new Promise((resolve, reject) => {
    ;(async () => {
        
        const client = await pool.connect()
        try {
            
            const queryText = 'SELECT * from accounts where LOWER(username)=LOWER(:username) LIMIT 1'
            const list = await client.query(sql(queryText)({username:username}))
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
            
            const queryText = 'SELECT * from accounts where contactnumber=:contactnumber LIMIT 1'
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
        
      exports.createAccounts = async(body) => {
          
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
                         
if(body.email!=undefined){
    cols.push("email");
    param.push(":email");
    vals['email'] = body.email.toLowerCase() ; 
}
                         
if(body.name!=undefined){
    cols.push("name");
    param.push(":name");
    vals['name'] = body.name ; 
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
                         
if(body.password!=undefined){
    cols.push("password");
    param.push(":password");
    vals['password'] = body.password ; 
}
                         
         
if(body.country!=undefined){
    cols.push("country");
    param.push(":country");
    vals['country'] = body.country ; 
}

//if(body.walletbalance!=undefined){
    cols.push("walletbalance");
    param.push(":walletbalance");
    vals['walletbalance'] = 0.0 ;  
//}
                         
if(body.walletbalanceencrypted!=undefined){
    cols.push("walletbalanceencrypted");
    param.push(":walletbalanceencrypted");
    vals['walletbalanceencrypted'] = body.walletbalanceencrypted ; 
}
                         
if(body.status!=undefined){
    cols.push("status");
    param.push(":status");
    vals['status'] = body.status ; 
}


    cols.push("verfricationstatus");
    param.push(":verfricationstatus");
    vals['verfricationstatus'] = 0.0 ;  

                         
if(body.acctype!=undefined){
    cols.push("acctype");
    param.push(":acctype");
    vals['acctype'] = body.acctype ; 
}
                         
if(body.username!=undefined){
    cols.push("username");
    param.push(":username");
    vals['username'] = body.username.toLowerCase() ; 
}
                         
if(body.mobileno!=undefined){
    cols.push("mobileno");
    param.push(":mobileno");
    vals['mobileno'] = body.mobileno ; 
}
                         
if(body.otp!=undefined){
    cols.push("otp");
    param.push(":otp");
    vals['otp'] = body.otp ; 
}
                         
if(body.otpexpires!=undefined){
    cols.push("otpexpires");
    param.push(":otpexpires");
    vals['otpexpires'] = body.otpexpires ; 
}
                         
if(body.otpfor!=undefined){
    cols.push("otpfor");
    param.push(":otpfor");
    vals['otpfor'] = body.otpfor ; 
}

if(body.businessname!=undefined){
    cols.push("businessname");
    param.push(":businessname");
    vals['businessname'] = body.businessname ; 
}

if(body.businessregistration!=undefined){
    cols.push("businessregistration");
    param.push(":businessregistration");
    vals['businessregistration'] = body.businessregistration ; 
}


    
          var column = cols.join(',');
          var params = param.join(',');
          return new Promise((resolve, reject) => {
          ;(async () => {
            
            const client = await pool.connect()
            try {
                
        let   usernameCHeck =await this.findOne({"username":body.username.toLowerCase()})
        console.log(usernameCHeck);
        console.log("AAAAAAA:"+body.username.toLowerCase());
        if(usernameCHeck ) {
            reject("username exists");
            return;
          }
        
        let   contactnumberCHeck =await this.findOne({"email":body.email.toLowerCase()})
          if(contactnumberCHeck ) {
            reject("email exists");
            return;
          }
        
                await client.query('BEGIN');
                const queryText = 'INSERT INTO accounts('+column+') VALUES('+params+') RETURNING id ';
                //console.log(sql(queryText)(vals))
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


    if(query.walletbalance!=null ){
      if(!isNaN(query.walletbalance)){
        let walletbalance_ = queryBuilder_number(query,"walletbalance","walletbalance")
        cols.push(walletbalance_);
        vals['walletbalance'] = query.walletbalance;
      }
    }
    if(query.walletbalance_array){
        if(Array.isArray(query.walletbalance_array) && query.walletbalance_array.length==2){
            cols.push(" walletbalance BETWEEN :walletbalance_1 AND  :walletbalance_2 ");
            vals['walletbalance_1'] = query.walletbalance_array[0]
            vals['walletbalance_2'] = query.walletbalance_array[1]
        }else if(Array.isArray(query.walletbalance_array) && query.walletbalance_array.length>2){
            cols.push(" walletbalance = ANY(:walletbalance) ");
            const walletbalanceString = query.walletbalance_array.map((num) => num);
            vals['walletbalance'] = walletbalanceString;
        }
    }


    
    if(query.walletbalanceencrypted){
        let walletbalanceencrypted_ = queryBuilder_string(query,"walletbalanceencrypted","walletbalanceencrypted")
        cols.push(walletbalanceencrypted_);
        vals['walletbalanceencrypted'] = query.walletbalanceencrypted;
       
    }
    if(query.walletbalanceencrypted_array){
        if(Array.isArray(query.walletbalanceencrypted_array) && query.walletbalanceencrypted_array.length>1){
            cols.push(" walletbalanceencrypted = ANY(:walletbalanceencrypted) ");
            const walletbalanceencryptedString = query.walletbalanceencrypted_array.map((data) => data);
            vals['walletbalanceencrypted'] = walletbalanceencryptedString;
        }
    }


    
    if(query.status){
        let status_ = queryBuilder_string(query,"status","status")
        cols.push(status_);
        vals['status'] = query.status;
       
    }
    if(query.status_array){
        if(Array.isArray(query.status_array) && query.status_array.length>1){
            cols.push(" status = ANY(:status) ");
            const statusString = query.status_array.map((data) => data);
            vals['status'] = statusString;
        }
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


    
    if(query.acctype){
        let acctype_ = queryBuilder_string(query,"acctype","acctype")
        cols.push(acctype_);
        vals['acctype'] = query.acctype;
       
    }
    if(query.acctype_array){
        if(Array.isArray(query.acctype_array) && query.acctype_array.length>1){
            cols.push(" acctype = ANY(:acctype) ");
            const acctypeString = query.acctype_array.map((data) => data);
            vals['acctype'] = acctypeString;
        }
    }


    
    if(query.username){
        let username_ = queryBuilder_string(query,"username","username")
        cols.push(username_);
        vals['username'] = query.username;
       
    }
    if(query.username_array){
        if(Array.isArray(query.username_array) && query.username_array.length>1){
            cols.push(" username = ANY(:username) ");
            const usernameString = query.username_array.map((data) => data);
            vals['username'] = usernameString;
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


    
    if(query.otp){
        let otp_ = queryBuilder_string(query,"otp","otp")
        cols.push(otp_);
        vals['otp'] = query.otp;
       
    }
    if(query.otp_array){
        if(Array.isArray(query.otp_array) && query.otp_array.length>1){
            cols.push(" otp = ANY(:otp) ");
            const otpString = query.otp_array.map((data) => data);
            vals['otp'] = otpString;
        }
    }


        if(query.otpexpires){
            let otpexpires_ = queryBuilder_date(query,"otpexpires","otpexpires")
            cols.push(otpexpires_);
            vals['otpexpires'] = query.otpexpires;   
        }
        if(query.otpexpires_array){
            if(Array.isArray(query.otpexpires_array) && query.otpexpires_array.length==2){
                cols.push(" otpexpires BETWEEN :otpexpires_1 AND  :otpexpires_2 ");
                vals['otpexpires_1'] = new Date(query.otpexpires_array[0])
                vals['otpexpires_2'] = new Date(query.otpexpires_array[1])
            }else if(Array.isArray(query.otpexpires_array) && query.otpexpires_array.length>2){
                cols.push(" otpexpires = ANY(:otpexpires::date[]) ");
                const otpexpiresString = query.otpexpires_array.map((date) => date);
                vals['otpexpires'] = otpexpiresString;
            }
        }
    

    
    if(query.otpfor){
        let otpfor_ = queryBuilder_string(query,"otpfor","otpfor")
        cols.push(otpfor_);
        vals['otpfor'] = query.otpfor;
       
    }
    if(query.otpfor_array){
        if(Array.isArray(query.otpfor_array) && query.otpfor_array.length>1){
            cols.push(" otpfor = ANY(:otpfor) ");
            const otpforString = query.otpfor_array.map((data) => data);
            vals['otpfor'] = otpforString;
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
                 
                    const queryText = 'SELECT * from accounts' +searchConditions+' order by '+sortBy+' '+sortDirection+' LIMIT '+perPage+' OFFSET '+offset;
                    const list = await client.query(sql(queryText)(vals));
                    const queryTextCount = 'SELECT COUNT(*) as total from accounts' +searchConditions
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
             
                const queryText = 'SELECT * from accounts' +searchConditions+'  LIMIT '+perPage;
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
    let keyConditions =` WHERE  (email LIKe '%' || :search || '%' 
 OR name LIKe '%' || :search || '%' 
 OR address LIKe '%' || :search || '%' 
 OR city LIKe '%' || :search || '%' 
 OR state LIKe '%' || :search || '%' 
 OR postcode LIKe '%' || :search || '%' 
 OR country LIKe '%' || :search || '%' 
 OR acctype LIKe '%' || :search || '%' 
 OR username LIKe '%' || :search || '%' 
 OR contactnumber LIKe '%' || :search || '%' )`;
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
         
            const queryText = 'SELECT * from accounts' +searchConditions+' order by '+sortBy+' '+sortDirection+' LIMIT '+perPage;
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
exports.patchAccounts = async(id, reqData,extraFields={}) => {
    var body = reqData;
        
    var cols=[];
    var vals = {};
    console.log(reqData)
                             

                             
if(body.updateby!=undefined){
    cols.push("updateby = :updateby");
    vals['updateby'] = body.updateby ;  
}
                             

    cols.push("updateat = :updateat");
    vals['updateat'] = funcs.getTime() ;  

                             
if(body.email!=undefined){
    cols.push("email = :email");
    vals['email'] = body.email ;  
}
                             
if(body.name!=undefined){
    cols.push("name = :name");
    vals['name'] = body.name ;  
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
                             
if(body.password!=undefined){
    cols.push("password = :password");
    vals['password'] = body.password ;  
}
                             

                             
if(body.country!=undefined){
    cols.push("country = :country");
    vals['country'] = body.country ;  
}

if(body.walletbalance!=undefined){
    cols.push("walletbalance = :walletbalance");
    vals['walletbalance'] = parseFloat(body.walletbalance) ;    
}
                             
if(body.walletbalanceencrypted!=undefined){
    cols.push("walletbalanceencrypted = :walletbalanceencrypted");
    vals['walletbalanceencrypted'] = body.walletbalanceencrypted ;  
}
                             
if(body.status!=undefined){
    cols.push("status = :status");
    vals['status'] = body.status ;  
}

if(body.verfricationstatus!=undefined){
    cols.push("verfricationstatus = :verfricationstatus");
    vals['verfricationstatus'] = parseFloat(body.verfricationstatus) ;    
}
                             
if(body.acctype!=undefined){
    cols.push("acctype = :acctype");
    vals['acctype'] = body.acctype ;  
}
                             

                             
if(body.mobileno!=undefined){
    cols.push("mobileno = :mobileno");
    vals['mobileno'] = body.mobileno ;  
}
                             
if(body.otp!=undefined){
    cols.push("otp = :otp");
    vals['otp'] = body.otp ;  
}
                             
if(body.otpexpires!=undefined){
    cols.push("otpexpires = :otpexpires");
    vals['otpexpires'] = body.otpexpires ;  
}
                             
if(body.otpfor!=undefined){
    cols.push("otpfor = :otpfor");
    vals['otpfor'] = body.otpfor ;  
}




 if(body.mothermaidenname!=undefined){
    cols.push("mothermaidenname = :mothermaidenname");
    vals['mothermaidenname'] = body.mothermaidenname ;  
}
if(body.occupation!=undefined){
    cols.push("occupation = :occupation");
    vals['occupation'] = body.occupation ;  
}

if(body.joblevel!=undefined){
    cols.push("joblevel = :joblevel");
    vals['joblevel'] = body.joblevel ;  
}

if(body.employer_name!=undefined){
    cols.push("employer_name = :employer_name");
    vals['employer_name'] = body.employer_name ;  
}

if(body.parentname!=undefined){
    cols.push("parentname = :parentname");
    vals['parentname'] = body.parentname ;  
}

if(body.parentemail!=undefined){
    cols.push("parentemail = :parentemail");
    vals['parentemail'] = body.parentemail ;  
}
if(body.parentmobileno!=undefined){
    cols.push("parentmobileno = :parentmobileno");
    vals['parentmobileno'] = body.parentmobileno ;  
}
if(body.parentidno!=undefined){
    cols.push("parentidno = :parentidno");
    vals['parentidno'] = body.parentidno ;  
}

if(body.idno!=undefined){
    cols.push("idno = :idno");
    vals['idno'] = body.idno ;  
}

if(body.nationality!=undefined){
    cols.push("nationality = :nationality");
    vals['nationality'] = body.nationality ;  
}

if(body.dob !=undefined){
    cols.push("dob = :dob");
    vals['dob'] = body.dob ;  
}
if(body.province !=undefined){
    cols.push("province = :province");
    vals['province'] = body.province ;  
}

if(body.addcountry!=undefined){
    cols.push("addcountry = :addcountry");
    vals['addcountry'] = body.addcountry ;  

    cols.push("country = :country");
    vals['country'] = body.addcountry ;  
}

if(body.uid!=undefined){
    cols.push("uid = :uid");
    vals['uid'] = body.uid ;  
}
if(body.mpaysteps!=undefined){
    cols.push("mpaysteps = :mpaysteps");
    vals['mpaysteps'] = body.mpaysteps ;  
}


if(body.add_country!=undefined){
    cols.push("addcountry = :addcountry");
    vals['addcountry'] = body.add_country ;  
    cols.push("country = :country");
    vals['country'] = body.add_country ;  
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
             
        if(body.username!=undefined){
        let   usernameCHeck =await this.findOne({id:{ne:id},"username":body.username})
          if(usernameCHeck ) {
            reject("username exists");
            return;
          }
        }
        
        if(body.mobileno!=undefined){
        let   contactnumberCHeck =await this.findOne({id:{ne:id},"mobileno":body.mobileno})
          if(contactnumberCHeck ) {
            reject("mobileno exists");
            return;
          }
        }
        
              await client.query('BEGIN');
              const queryText = 'UPDATE accounts SET '+column+'  WHERE id =:id'+searchConditions
              const updated = await client.query(sql(queryText)(vals));
              //console.log(sql(queryText)(vals))
              await client.query('COMMIT');
              //VCache.resetCache("accounts_list");
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
      
      exports.removeById = (accountsId,extraFields={}) => {
          return new Promise((resolve, reject) => {
            ;(async () => {
                const extra = queryFormatter(extraFields)
                let vals= {id:accountsId};
                let searchConditions=""
                if(extra.cols.length>0){
                    vals={...vals,...extra.vals};
                    searchConditions=" AND " + extra.cols.join(" AND ")
                }
                const client = await pool.connect()
                try {
                    await client.query('BEGIN')
                    const queryText = 'DELETE FROM accounts  WHERE  id=:id '+searchConditions
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
              const queryText = 'UPDATE accounts SET '+colName+'=:0  where id =:1';
              const updated = await client.query(sql(queryText)([uploadedFileName,rowId]));
              //console.log(sql(queryText)(vals))
              await client.query('COMMIT');
              //VCache.resetCache("accounts_list");
              resolve(uploadedFileName)
            } catch (e) {
              
                reject(e);
                
            } finally {
                client.release()
            }
            })().catch(e =>  reject(e.stack))
        });
        };
        
  


exports.updateBalance = async(username, amount) => {
      
       
        var vals = {};
            vals= {username:username,amount:amount}; 
            return new Promise((resolve, reject) => {
            ;(async () => {
              const client = await pool.connect()
              try {
                  await client.query('BEGIN');
                  const queryText = 'UPDATE accounts SET walletbalance=walletbalance+:amount ,updateat=NOW()  WHERE username =:username RETURNING *'
                  console.log(sql(queryText)(vals))
                  const {rows:updatedRows} = await client.query(sql(queryText)(vals));
                 
                  console.log("sql(queryText)(vals)")
                  await client.query('COMMIT');
                 
                 
                  if(updatedRows.length>0){
                    resolve(updatedRows[0]);
                 }else{
                    reject({error:'not updated'});
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
exports.updateBalanceID = async(id, amount) => {
  
    var cols=[];
    var vals = {};
        vals= {id:id,amount:amount}; 
        return new Promise((resolve, reject) => {
        ;(async () => {
          const client = await pool.connect()
          try {
              await client.query('BEGIN');
              const queryText = 'UPDATE accounts SET walletbalance=walletbalance+:amount ,updateat=NOW()  WHERE id =:id RETURNING * '
              
              console.log(sql(queryText)(vals))
              const {rows:updatedRows} = await client.query(sql(queryText)(vals));
             
              await client.query('COMMIT');
             if(updatedRows.length>0){
                resolve(updatedRows[0]);
             }else{
                reject({error:'not updated'});
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