const pool = require("../db");
    const VCache = require('../../lib/cache');
    const funcs =  require("../../common/functions/funcs");
    const mpay = require("../../common/functions/mpay");
    const crypto = require('crypto');
    const MpaycardModel = require('../../src/mpaycard/mpaycard.model');
    const AccountDocumentsModel = require('../../src/accountDocuments/accountDocuments.model');
    const AccountsModel = require('../../src/accounts/accounts.model');
    const bankModel = require('../../src/bank/bank.model');
    const bankAccountModel = require('../../src/bankaccount/bankaccount.model');
    const LogModel = require('../../src/mpaylog/mpaylog.model');
    const {queryFormatter,queryBuilder_string,
        queryBuilder_number,
        queryBuilder_date} = require("../../common/functions/queryutilPostgre");
    const { resolve } = require("dns");
    const e = require("express");
    var sql = require('yesql').pg
    
    
      exports.bankEnroll = (req) => {
        const postData=req.body;
        return new Promise((resolve, reject) => {
            ;(async () => {
               
                try {
                  //console.log(req.jwt)
                    const account = await AccountsModel.findById(req.jwt.userId);
                    //console.log(account)
                    if(postData.acc_no.trim().length<6){
                      reject("invalid Bank Account no");
                      return;
                    }
                    if(account){
                        let doc_number= postData.acc_no+"_bankImgString"
                        //console.log("MP=>1")
                        //let bankDoc = await AccountDocumentsModel.findByDocType(req.jwt.email,doc_number);
                        let bankDoc={};
                        
                  
                        req.body={
                          "uid":funcs.null2empty(account.uid),
                          "recipientbank_id":postData.bank_id,
                          "accType":postData.acctype_id,
                          "acc_desc":postData.acc_desc,
                          "acc_no":postData.acc_no,
                          "bankImgName":bankDoc.documentnumber?bankDoc.documentnumber:"",
                          "bankImgString":bankDoc.file?bankDoc.file:""
                        
                        }
                     
                     
                    }else{
                      reject("invalid_user");
                      return;
                    }
                    const time = funcs.getCurrentDateTime()
                    
                    const authtoken=  mpay.generateAuthToken2(req.body,time)
                    const lrc= mpay.getLRC(authtoken,req.body,time)
                    const data={
                      authtoken:authtoken,
                      timestamp:time,
                      PID:mpay.getPID(),
                      ...req.body,
                    
                      lrc:lrc
                  
                  }
                
                   const res=   await mpay.post(mpay.getAccEnroll(), data);
           
  
                if(res.Header.status=="00"){
                  
                 
                 
                  resolve(res);
                }else{
                  console.log(res)
                  console.log(time)
                  const {useridimagestring,userselfieimagestring,...restLogdata}=req.body;
                  let eBody={
                    "username":req.jwt.username,
                    "timestamp":time,
                    "modname":"BANK-ENROLL",
                    "errors":res.Header.message,
                    "createat":funcs.getTime(),
                    "createby":req.jwt.email,
                    "data": JSON.stringify( restLogdata)
                  }

                  await LogModel.createMpaylog(eBody);
                  reject(res.Header.message);
                }
                
                   
                } catch (e) {
                    console.log(e)
                    reject(e);
                } finally {
                
                }
                })().catch(e => reject(e.stack))
          });
        
      };
     

      exports.bankAccList = (req) => {
        return new Promise(async(resolve, reject) => {
          try{
        const account = await AccountsModel.findById(req.jwt.userId);
       

        
       
        if(account){
          if(funcs.null2empty(account.uid).length==0){
            reject("MPay registration not complete");
            return;
          }else{
           
            req.body= {
              "uid":funcs.null2empty(account.uid)

            };
           
            const excludeData =req.body
              const time = funcs.getCurrentDateTime()
              const authtoken=  mpay.generateAuthToken(req.body,time)
              
              const lrc= mpay.getLRC(authtoken,excludeData,time)
            
              const data={
                authtoken:authtoken,
                timestamp:time,
                PID:mpay.getPID(),
                ...req.body,
                lrc:lrc
            }
           
               const res=  await mpay.post(mpay.getAccBankList(), data);
                if(res.Header.status=="00"){
                  await bankAccountModel.syncBankData(res.Body.bankaccinfo,req.jwt.email);
                  resolve(res)
                }else{
                  console.log(res)
                  let eBody={
                    "username":req.jwt.username,
                    "timestamp":time,
                    "modname":"BANK-ACC-LIST",
                    "errors":res.Body.transactionstatusdesc?res.Body.transactionstatusdesc:res.Body,
                    "createat":funcs.getTime(),
                    "createby":req.jwt.email,
                    "data": JSON.stringify( req.body)
                    
                  }

                  await LogModel.createMpaylog(eBody);
                  reject(res.Header.message?res.Header.message:res.Body)
                }


          
          }
        }
      }catch(err){
        console.log(err)
        reject(err)
      }
      })

        

      };
      exports.bankList = (req) => {
        return new Promise(async(resolve, reject) => {
          try{
          
      
        
           
            
              const time = funcs.getCurrentDateTime()
              const authtoken=  mpay.generateAuthToken({},time)
              
              const lrc= mpay.getLRC2(authtoken,time)
            
              const data={
                authtoken:authtoken,
                timestamp:time,
                PID:mpay.getPID(),
                lrc:lrc
            }
           
               const res=  await mpay.post(mpay.getBankList(), data);
                if(res.Header.status=="00"){
                  await bankModel.syncBankData(res.Body.bankinfo);
                  resolve(res)
                }else{
                  console.log(res)
                  let eBody={
                    "username":req.jwt.username,
                    "timestamp":time,
                    "modname":"BANK-LIST",
                    "errors":res.Header.message,
                    "createat":funcs.getTime(),
                    "createby":req.jwt.email
                  }

                  await LogModel.createMpaylog(eBody);
                  reject(res.Header.message)
                }


          
        
        
      }catch(err){
        reject(err)
      }
     })
      };


      exports.uploadBankDoc = (req) => {
        return new Promise(async(resolve, reject) => {
          const postData=req.body;
          try{
        const account = await AccountsModel.findById(req.jwt.userId);
        //console.log(account)
        if(account){
          if(funcs.null2empty(account.uid).length==0){
            reject("MPay registration not complete");
            return;
          }else{
            
            //let doc_number= postData.accNo+"_bankImgString"
                        //console.log("MP=>1")
            //let bankDoc = await AccountDocumentsModel.findByDocType(req.jwt.email,doc_number);
            req.body={
              "uid":funcs.null2empty(account.uid),
              "acc_no":postData.acc_no.trim(),
              "bankImgName":postData.filename?postData.filename:"",
              "bankImgString":postData.file?postData.file:""
            };
           
          
              const time = funcs.getCurrentDateTime()
              const authtoken=  mpay.generateAuthToken2(req.body,time)
              
              const lrc= mpay.getLRC(authtoken,req.body,time)
            
              const data={
                authtoken:authtoken,
                timestamp:time,
                PID:mpay.getPID(),
                ...req.body,
                lrc:lrc
            }
           
               const res=  await mpay.post(mpay.getUploadBankDoc(), data);
                if(res.Header.status=="00"){
                  resolve(res)
                }else{
                  console.log(res)
                  let eBody={
                    "username":req.jwt.username,
                    "timestamp":time,
                    "modname":"UPLOAD-BANK-DOC",
                    "errors":res.Header.message,
                    "createat":funcs.getTime(),
                    "createby":req.jwt.email
                  }

                  await LogModel.createMpaylog(eBody);
                  reject(res.Header.message)
                }


          
          }
        }
      }catch(err){
        reject(err)
      }
      })
      };
      exports.removeBankAcc = (req) => {

        return new Promise(async(resolve, reject) => {
          const postData=req.body;
          try{
        const account = await AccountsModel.findById(req.jwt.userId);
        //console.log(account)
        if(account){
          if(funcs.null2empty(account.uid).length==0){
            reject("MPay registration not complete");
            return;
          }else{
            //console.log("MP=>1")
            //const card = await MpaycardModel.findOne({createby:req.jwt.email,uid:account.uid});
            //const amount =  Math.round(parseFloat(req.body.amount) * 100);
            //if(amount<10000){
              //reject("Top-up amount must be 100 or above");
             // return;
          //  }
            req.body={
              "uid":funcs.null2empty(account.uid),
              "acc_no":postData.acc_no.trim(),
              "bankInfo_Id":postData.bankinfo_id
            };
           
          
              const time = funcs.getCurrentDateTime()
              const authtoken=  mpay.generateAuthToken2(req.body,time)
              
              const lrc= mpay.getLRC(authtoken,req.body,time)
            
              const data={
                authtoken:authtoken,
                timestamp:time,
                PID:mpay.getPID(),
                ...req.body,
                lrc:lrc
            }
           
               const res=  await mpay.post(mpay.getRemoveBankAcc(), data);
                if(res.Header.status=="00"){
                  resolve(res)
                }else{
                  console.log(res)

                  let eBody={
                    "username":req.jwt.username,
                    "timestamp":time,
                    "modname":"BANK-REMOVE",
                    "errors":res.Header.message,
                    "createat":funcs.getTime(),
                    "createby":req.jwt.email,
                    "data": JSON.stringify( req.body)
                  }

                  await LogModel.createMpaylog(eBody);
                  reject(res.Header.message)
                }


          
          }
        }
      }catch(err){
        reject(err)
      }
      })

      };
      

      exports.casaFundTransfer = (req) => {
        const postData=req.body;
        return new Promise(async(resolve, reject) => {
          try{
       // const transferReferrence = require("../../data/transferReference"); 
        const account = await AccountsModel.findById(req.jwt.userId);
       
  
        const bankId =postData.bankid;
        let reference =   postData.reference;
        const cardpin =   postData.cardpin?postData.cardpin:"";
       
        if(account){
          if(funcs.null2empty(account.uid).length==0){
            reject("MPay registration not complete");
            return;
          }else{
           
            const card = await MpaycardModel.findOne({createby:req.jwt.email,uid:account.uid});
            const amount =  parseFloat(req.body.amount);
            const ip = req.socket.remoteAddress;
            req.body={
              "amount":amount.toString(),
              "bankinfo_id":bankId,
              "cardpin":cardpin,
              "reference":reference,
              "srcAccToken":card.cardtoken?card.cardtoken:"",
              "uid":funcs.null2empty(account.uid)
            };
         // console.log(req.body)
          // return;
            const {ip_address,recipient_type,...excludeData} =req.body
              const time = funcs.getCurrentDateTime()
              const authtoken=  mpay.generateAuthToken(excludeData,time,recipient_type)
              
              const lrc= mpay.getLRC(authtoken,excludeData,time,recipient_type)
            
              const data={
                authtoken:authtoken,
                timestamp:time,
                PID:mpay.getPID(),
                ...req.body,
                lrc:lrc
            }
            
               const res=  await mpay.post(mpay.getCasaFundTransfer(), data);
              
                if(res?.Header?.status=="00"){
                  resolve(res)
                }else{
                  console.log(res)

                  let eBody={
                    "username":req.jwt.username,
                    "timestamp":time,
                    "modname":"CASA_FUND_TRANSFER",
                    "errors":res?.Header?.message,
                    "createat":funcs.getTime(),
                    "createby":req.jwt.email
                  }

                  await LogModel.createMpaylog(eBody);
                  reject(res?.Header?.message)
                }


          
          }
        }
      }catch(err){
        console.log(err)
        reject(err)
      }
      })
      };
      