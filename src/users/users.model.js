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
        const {cols,vals} = queryFormatter(querys)
        var condition=cols.length>0?" WHERE "+cols.join(" AND ") :""
        return new Promise((resolve, reject) => {
        ;(async () => {
           
            const client = await pool.connect()
            try {
                const queryText = 'SELECT * from accounts '+condition+' LIMIT 1'
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

exports.findByEmail = (email,checkPrev=false) => {
    return new Promise((resolve, reject) => {
        let preCheck="";
    ;(async () => {
        
        const client = await pool.connect()
        try {
            if(checkPrev){
                //preCheck= "AND otpexpires<NOW()";
            }
            const queryText = 'SELECT * from accounts where email=:email '+preCheck+' LIMIT 1'
            const list = await client.query(sql(queryText)({email:email}))
            console.log("FFFF")
            if(list.rows.length>0){
                console.log("FFFDDDF")
                resolve(list.rows[0]);
            }else{
                reject("No Info")
            }
            
        } catch (e) {
            console.log(e)
            resolve({})
            
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
                
                const queryText = 'SELECT * from accounts where LOWER(username)=LOWER(:username)  LIMIT 1'
                console.log(sql(queryText)({username:username}))
                const list = await client.query(sql(queryText)({username:username}))
                console.log(sql(queryText)({username:username}))
                resolve(list.rows[0]);
                
            } catch (e) {
                console.log(e)
                reject(e);
                
            } finally {
                client.release()
            }
            })().catch(e =>  reject(e.stack))
        });
        
        };
    exports.findByEmailWithOTP = (email) => {
        return new Promise((resolve, reject) => {
        ;(async () => {
            
            const client = await pool.connect()
            try {
                
                const queryText = 'SELECT * from accounts where LOWER(email)=LOWER(:email) AND otpexpires>NOW() LIMIT 1'
               console.log(sql(queryText)({email:email}))
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

exports.findByMobile = (mobile) => {
    return new Promise((resolve, reject) => {
    ;(async () => {
        
        const client = await pool.connect()
        try {
            
            const queryText = 'SELECT * from accounts where mobile=:mobile LIMIT 1'
            const list = await client.query(sql(queryText)({mobile:mobile}))
            resolve(list.rows[0]);
            
        } catch (e) {
            
            reject(e);
            
        } finally {
            client.release()
        }
        })().catch(e =>  reject(e.stack))
    });
    
    };
        
      exports.createUsers = async(body) => {
          
    var cols=[];
    var param=[];
    var vals = {};
    cols.push("id");
    param.push(":id");
    vals['id'] =crypto.randomUUID();
                      
if(body.usertype!=undefined){
    cols.push("usertype");
    param.push(":usertype");
    vals['usertype'] = parseInt(body.usertype) ;
}
                         
if(body.lastname!=undefined){
    cols.push("lastname");
    param.push(":lastname");
    vals['lastname'] = body.lastname ; 
}
                         
if(body.emailotp!=undefined){
    cols.push("emailotp");
    param.push(":emailotp");
    vals['emailotp'] = body.emailotp ; 
}
                         
if(body.firstname!=undefined){
    cols.push("firstname");
    param.push(":firstname");
    vals['firstname'] = body.firstname ; 
}
                         
if(body.password!=undefined){
    cols.push("password");
    param.push(":password");
    vals['password'] = body.password ; 
}
                         
if(body.email!=undefined){
    cols.push("email");
    param.push(":email");
    vals['email'] = body.email ; 
}
                         
if(body.mobile!=undefined){
    cols.push("mobile");
    param.push(":mobile");
    vals['mobile'] = body.mobile ; 
}
                      
if(body.emailotpexpires!=undefined){
    cols.push("emailotpexpires");
    param.push(":emailotpexpires");
    vals['emailotpexpires'] = parseInt(body.emailotpexpires) ;
}
                         
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
   

    
          var column = cols.join(',');
          var params = param.join(',');
          return new Promise((resolve, reject) => {
          ;(async () => {
            
            const client = await pool.connect()
            try {
                
        let   emailCHeck =await this.findOne({"email":body.email})
          if(emailCHeck ) {
            reject("email exists");
            return;
          }
        
        let   mobileCHeck =await this.findOne({"mobile":body.mobile})
          if(mobileCHeck ) {
            reject("mobile exists");
            return;
          }
        
                await client.query('BEGIN');
                const queryText = 'INSERT INTO accounts('+column+') VALUES('+params+') RETURNING id ';
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
    

    if(query.usertype!=null ){
      if(!isNaN(query.usertype)){
        let usertype_ = queryBuilder_number(query,"usertype","usertype")
        cols.push(usertype_);
        vals['usertype'] = query.usertype;
      }
    }
    if(query.usertype_array){
        if(Array.isArray(query.usertype_array) && query.usertype_array.length==2){
            cols.push(" usertype BETWEEN :usertype_1 AND  :usertype_2 ");
            vals['usertype_1'] = query.usertype_array[0]
            vals['usertype_2'] = query.usertype_array[1]
        }else if(Array.isArray(query.usertype_array) && query.usertype_array.length>2){
            cols.push(" usertype = ANY(:usertype) ");
            const usertypeString = query.usertype_array.map((num) => num);
            vals['usertype'] = usertypeString;
        }
    }


    
    if(query.lastname){
        let lastname_ = queryBuilder_string(query,"lastname","lastname")
        cols.push(lastname_);
        vals['lastname'] = query.lastname;
       
    }
    if(query.lastname_array){
        if(Array.isArray(query.lastname_array) && query.lastname_array.length>1){
            cols.push(" lastname = ANY(:lastname) ");
            const lastnameString = query.lastname_array.map((data) => data);
            vals['lastname'] = lastnameString;
        }
    }


    
    query.emailotp_mode = "equals"
    if(query.emailotp){
        let emailotp_ = queryBuilder_string(query,"emailotp","emailotp")
        cols.push(emailotp_);
        vals['emailotp'] = query.emailotp;
       
    }
    if(query.emailotp_array){
        if(Array.isArray(query.emailotp_array) && query.emailotp_array.length>1){
            cols.push(" emailotp = ANY(:emailotp) ");
            const emailotpString = query.emailotp_array.map((data) => data);
            vals['emailotp'] = emailotpString;
        }
    }


    
    if(query.firstname){
        let firstname_ = queryBuilder_string(query,"firstname","firstname")
        cols.push(firstname_);
        vals['firstname'] = query.firstname;
       
    }
    if(query.firstname_array){
        if(Array.isArray(query.firstname_array) && query.firstname_array.length>1){
            cols.push(" firstname = ANY(:firstname) ");
            const firstnameString = query.firstname_array.map((data) => data);
            vals['firstname'] = firstnameString;
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


    
    if(query.mobile){
        let mobile_ = queryBuilder_string(query,"mobile","mobile")
        cols.push(mobile_);
        vals['mobile'] = query.mobile;
       
    }
    if(query.mobile_array){
        if(Array.isArray(query.mobile_array) && query.mobile_array.length>1){
            cols.push(" mobile = ANY(:mobile) ");
            const mobileString = query.mobile_array.map((data) => data);
            vals['mobile'] = mobileString;
        }
    }


    if(query.emailotpexpires!=null ){
      if(!isNaN(query.emailotpexpires)){
        let emailotpexpires_ = queryBuilder_number(query,"emailotpexpires","emailotpexpires")
        cols.push(emailotpexpires_);
        vals['emailotpexpires'] = query.emailotpexpires;
      }
    }
    if(query.emailotpexpires_array){
        if(Array.isArray(query.emailotpexpires_array) && query.emailotpexpires_array.length==2){
            cols.push(" emailotpexpires BETWEEN :emailotpexpires_1 AND  :emailotpexpires_2 ");
            vals['emailotpexpires_1'] = query.emailotpexpires_array[0]
            vals['emailotpexpires_2'] = query.emailotpexpires_array[1]
        }else if(Array.isArray(query.emailotpexpires_array) && query.emailotpexpires_array.length>2){
            cols.push(" emailotpexpires = ANY(:emailotpexpires) ");
            const emailotpexpiresString = query.emailotpexpires_array.map((num) => num);
            vals['emailotpexpires'] = emailotpexpiresString;
        }
    }


    
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
    let keyConditions =` WHERE  (lastname LIKe '%' || :search || '%' 
 OR firstname LIKe '%' || :search || '%' 
 OR email LIKe '%' || :search || '%' 
 OR mobile LIKe '%' || :search || '%' )`;
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
      exports.patchUsers = async(id, reqData,extraFields={}) => {
        var body = reqData;
        
    var cols=[];
    var vals = {};
    
                             
if(body.usertype!=undefined){
    cols.push("usertype = :usertype");
    vals['usertype'] = parseInt(body.usertype) ; 
}
                             
if(body.lastname!=undefined){
    cols.push("lastname = :lastname");
    vals['lastname'] = body.lastname ;  
}
                             
if(body.otp!=undefined){
    cols.push("otp = :otp");
    vals['otp'] = body.otp ;  
}
                             
if(body.firstname!=undefined){
    cols.push("firstname = :firstname");
    vals['firstname'] = body.firstname ;  
}
                             
if(body.password!=undefined){
    cols.push("password = :password");
    vals['password'] = body.password ;  
}
                             
if(body.email!=undefined){
    cols.push("email = :email");
    vals['email'] = body.email ;  
}
                             
if(body.mobile!=undefined){
    cols.push("mobile = :mobile");
    vals['mobile'] = body.mobile ;  
}
                             
if(body.otpexpires!=undefined){
    cols.push("otpexpires = :otpexpires");
    vals['otpexpires'] = parseInt(body.otpexpires) ; 
}
                             
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
             
        if(body.email!=undefined){
        let   emailCHeck =await this.findOne({id:{ne:id},"email":body.email})
          if(emailCHeck ) {
            reject("email exists");
            return;
          }
        }
        
        if(body.mobile!=undefined){
        let   mobileCHeck =await this.findOne({id:{ne:id},"mobile":body.mobile})
          if(mobileCHeck ) {
            reject("mobile exists");
            return;
          }
        }
        
              await client.query('BEGIN');
              const queryText = 'UPDATE accounts SET '+column+'  WHERE id =:id'+searchConditions
              const updated = await client.query(sql(queryText)(vals));
              //console.log(sql(queryText)(vals))
              await client.query('COMMIT');
              //VCache.resetCache("users_list");
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

exports.updateOTP = async(id, OTP) => {
    //console.log("1ASAS") 
    var body = {};
    var cols=[];
    var vals = {};
   // console.log(OTP) 
    let salt = crypto.randomBytes(16).toString('base64');
    //console.log(OTP) 
    let hash = crypto.createHmac('sha512', salt).update(OTP.toString()).digest("base64");
   // console.log(OTP) 
    let otpec = salt + "$" + hash;

        // console.log("ASAS")           
if(otpec!=undefined){
    cols.push("otp = :otp");
    vals['otp'] = otpec ;  
}
                                                      

                             

                    
        vals= {...vals,id:id}; 
        var column = cols.join(',');
       // console.log(column)
        return new Promise((resolve, reject) => {
        ;(async () => {
          
          const client = await pool.connect()
          try {
             
        
              await client.query('BEGIN');
              const queryText = 'UPDATE accounts SET otp=:otp,otpexpires=CURRENT_TIMESTAMP + INTERVAL \'5 minutes\'   WHERE id =:id'
             // console.log(queryText)
            //  console.log(sql(queryText)(vals))
              const updated = await client.query(sql(queryText)(vals));
              
              await client.query('COMMIT');
              //VCache.resetCache("users_list");
              resolve(updated);
          } catch (e) {
              await client.query('ROLLBACK')
             // console.log(e);
              reject(e);
          } finally {
              client.release()
          }
          })().catch(e =>  reject(e))
      });
      
      };
      exports.flushOTP = async(id) => {
      
       
        var vals = {};
       
                        
            vals= {id:id}; 
           
            return new Promise((resolve, reject) => {
            ;(async () => {
              
              const client = await pool.connect()
              try {
                 
            
                  await client.query('BEGIN');
                  const queryText = 'UPDATE accounts SET otpexpires=CURRENT_TIMESTAMP   WHERE id =:id'
                 // console.log(queryText)
                //  console.log(sql(queryText)(vals))
                  const updated = await client.query(sql(queryText)(vals));
                  
                  await client.query('COMMIT');
                  //VCache.resetCache("users_list");
                  resolve(updated);
              } catch (e) {
                  await client.query('ROLLBACK')
                 // console.log(e);
                  reject(e);
              } finally {
                  client.release()
              }
              })().catch(e =>  reject(e))
          });
          
          };
      exports.removeById = (usersId,extraFields={}) => {
          return new Promise((resolve, reject) => {
            ;(async () => {
                const extra = queryFormatter(extraFields)
                let vals= {id:usersId};
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
      
  


      exports.updatePassword = async(id, password) => {
   
        var cols=[];
        var vals = {};
       
        let salt = crypto.randomBytes(16).toString('base64');
      
        let hash = crypto.createHmac('sha512', salt).update(password.toString()).digest("base64");
      
        let passwordec = salt + "$" + hash;
    
            // console.log("ASAS")           
    if(passwordec!=undefined){
        cols.push("password = :password");
        vals['password'] = passwordec ;  
    }
                                                          
    
                                 
    
                        
            vals= {...vals,id:id}; 
            var column = cols.join(',');
           // console.log(column)
            return new Promise((resolve, reject) => {
            ;(async () => {
              
              const client = await pool.connect()
              try {
                 
            
                  await client.query('BEGIN');
                  const queryText = 'UPDATE accounts SET password=:password  WHERE id =:id'
                
                  const updated = await client.query(sql(queryText)(vals));
                  
                  await client.query('COMMIT');
                 
                  resolve(updated);
              } catch (e) {
                  await client.query('ROLLBACK')
               
                  reject(e);
              } finally {
                  client.release()
              }
              })().catch(e =>  reject(e))
          });
          
          };

          exports.requestOtp2 = async(username,otpfor) => {
            var vals = {};         
            vals= {username:username,otpfor:otpfor}; 
                       
            return new Promise((resolve, reject) => {
            ;(async () => {
                
                const client = await pool.connect()
                try {
                    
                    await client.query('BEGIN');
                    const queryText = 'UPDATE accounts SET otpfor=:otpfor,otp2expires=CURRENT_TIMESTAMP + INTERVAL \'30 minutes\'   WHERE username =:username'
                    const updated = await client.query(sql(queryText)(vals));
                    
                    await client.query('COMMIT');
                    //VCache.resetCache("users_list");
                    resolve(vals);
                } catch (e) {
                    await client.query('ROLLBACK')
                    // console.log(e);
                    reject(e);
                } finally {
                    client.release()
                }
                })().catch(e =>  reject(e))
            });
                      
        };
        
        exports.getOtp2For = async(username) => {
            var vals = {};         
            vals= {username:username}; 
                       
            return new Promise((resolve, reject) => {
            ;(async () => {
                
                const client = await pool.connect()
                try {
                    
                    await client.query('BEGIN');
                    const queryText = 'SELECT  otpfor,otp2expires from accounts    WHERE username =:username and  otp2expires>CURRENT_TIMESTAMP'
                    const list = await client.query(sql(queryText)(vals));
                    await client.query('COMMIT');
                    if(list.rows.length>0){
                        resolve(list.rows[0]);
                    }else{
                        reject("No-info");
                    }
                    
                    
                    
                    
                   
                } catch (e) {
                    console.log(e)
                    await client.query('ROLLBACK')
                    // console.log(e);
                    reject(e);
                } finally {
                    client.release()
                }
                })().catch(e =>  reject(e))
            });
                      
        };
        
        
        
        exports.updateOtp2 = async(username,OTP) => {
              
               
            var vals = {};
            let salt = crypto.randomBytes(16).toString('base64');
            //console.log(OTP) 
            let hash = crypto.createHmac('sha512', salt).update(OTP.toString()).digest("base64");
            // console.log(OTP) 
            let otpec = salt + "$" + hash;
            vals= {username:username}; 
                  
            if(otpec!=undefined){
                
                vals['otp2'] = otpec ;  
            }
                        
        
        
            return new Promise((resolve, reject) => {
            ;(async () => {
                
                const client = await pool.connect()
                try {
                    
        
                    await client.query('BEGIN');
                    const queryText = 'UPDATE accounts SET otp2=:otp2,otp2expires=CURRENT_TIMESTAMP + INTERVAL \'5 minutes\'   WHERE username =:username'
        
                  
                    const updated = await client.query(sql(queryText)(vals));
                    
                    await client.query('COMMIT');
                    //VCache.resetCache("users_list");
                    resolve({OTP:OTP});
                } catch (e) {
                    await client.query('ROLLBACK')
                    // console.log(e);
                    reject(e);
                } finally {
                    client.release()
                }
                })().catch(e =>  reject(e))
            });
        };
        
        
        exports.verifyOtp2= async(username,OTP,myself) => {
            return new Promise((resolve, reject) => {
                ;(async () => {
                    
                    const client = await pool.connect()
                    await client.query('BEGIN');
                    try {
            const vals={username:username}
            const queryText = 'SELECT otp2, otpfor,otp2expires from accounts    WHERE username =:username and  otp2expires>CURRENT_TIMESTAMP'
            console.log(sql(queryText)(vals))
            const list = await client.query(sql(queryText)(vals));
        
           
            if(list.rows.length>0){
            const data = list.rows[0];
            const fixedJsonString = data.otpfor
            .replace(/'/g, '"') // Replace single quotes with double quotes
            .replace(/(\w+):/g, '"$1":'); // Add quotes around keys
        
        // Parse the corrected JSON string
           const jsonObject = JSON.parse(fixedJsonString);
           
           if(jsonObject.username==myself){
               
            
                        let passwordFields = data.otp2.split('$');
                        let salt = passwordFields[0];
                        let hash = crypto.createHmac('sha512', salt).update(OTP).digest("base64");
                      
                        if (hash === passwordFields[1]) {
                            const queryText3 = 'UPDATE accounts SET otp2=:otp2,otp2expires=CURRENT_TIMESTAMP   WHERE username =:username'
                            let vals3={...vals,otp2:""}
                  
                            const updated = await client.query(sql(queryText3)(vals3));
                          
                            resolve({done:true});
        
                        }else{
                            reject("Wrong PIN code");
                        }
                    }else{
                        reject("Wrong authorization username");
                    }
                    }else{
        
                        reject("Wrong PIN code or it has been expired");
                    }
                } catch (e) {
                    await client.query('ROLLBACK')
                    // console.log(e);
                    reject(e);
                } finally {
                    client.release()
                }
                })().catch(e =>  reject(e))
            });
        
        }