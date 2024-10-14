
const funcs = require('./funcs')
const crypto = require('crypto');
const axios = require('axios');
const  env  = process.env;
const partner_key = 'EN35PHUIIJTDVV2XG3YUAABCDUH8W1ABJIHKANJK1549IYJ8EZH';

//const aaa='2FAFA284C924F47567A29F125C600F1A3A96656CB7A5EB0721BB783E9600B96F';
//const partner_key_1 = aaa;
const pid = '109999004474844';
const company_name = 'AlifPay';
//const base_url_uat="https://uat.mpay.my/mpayCZ"
const base_url=env.BASE_URL ;//"https://mpay.my/mpay"
const serviceUrl = base_url+'/tpwalletapi/account/topupaccount';

const doPayment= base_url+'/tpwalletapi/account/dopayment'
const register= base_url+'/tpwalletapi/account/registeracc';
const reuploaddoc = base_url+'/tpwalletapi/account/reuploadoc';
const getaccountinfo = base_url+'/tpwalletapi/account/getaccountinfo';

const topup = base_url+'/tpwalletapi/account/topupaccount';
const addCard = base_url+'/tpwalletapi/account/addCard';
const getcardbalance = base_url+'/tpwalletapi/account/getcardbalance';
//const dopayment =  base_url +'/tpwalletapi/account/dopayment'
const pinchange =  base_url +'/tpwalletapi/account/PINChange'
const gettranshistory =  base_url +'/tpwalletapi/account/GetTrxHistoryWithPIN'
const gettranshistoryauth = base_url+'/tpwalletapi/account/gettrxhistoryAuthWithPIN'

const fundtransfer = base_url+'/tpwalletapi/account/fundTransfer'

const updateUserInfo = base_url+'/tpwalletapi/account/updateUserInfo'
const getJobLevel = base_url+'/tpwalletapi/account/getJobLevel';
const getJobSpecialization =base_url+'/tpwalletapi/account/getJobSpecialization';
const getCustomVirtualCard = base_url+'/tpwalletapi/account/getCustomVirtualCard';

const ekyc=base_url+'/tpwalletapi/EKYC/doEkyc';
//CASA
const banklist=base_url+'/tpwalletapi/casa/bankList';
const bankAcclist=base_url+'/tpwalletapi/casa/bankAccList';
const bankeEnroll=base_url+'/tpwalletapi/casa/enrollAcc';

const removeBankAcc=base_url+'/tpwalletapi/casa/removeBankAcc';
const uploadBankDoc=base_url+'/tpwalletapi/casa/uploadbankdoc';
const casaFundTransfer=base_url+'/tpwalletapi/casa/casafundtransfer';

/*
PID : 109999004474844
partner_key : EN35PHUIIJTDVV2XG3YUAABCDUH8W1ABJIHKANJK1549IYJ8EZH

*/

const success={"Header":{"message":"Registration Successful.","status":"00"},"Body":{"useracc_info":{"uid":"117163","login_id":"kazad79@yahoo.com","name":"kalam Azad","mobileno":"60176701945","idno":"C07604706","email":"kazad79@yahoo.com"},"cardinfo":[{"cardtoken":"6368405QEa9l0692","cardtype_id":"1","cardtype":"MPay Balance","card_temporary_pin":"","card_id":"12400","cardGroup":"1","mask_cardno":"636840xxxxxx0692","status":"00"}]}};
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
// Function to make HTTP POST request
exports.getPID=()=>{
    return pid;
}
exports.getPartnerKey=()=>{
    return partner_key;
}
exports.uploadUrl=()=>{
    return reuploaddoc;
}
exports.ekycURL=()=>{
    return ekyc;
}
exports.userInfoUrl=()=>{
    return getaccountinfo;
}
exports.topupUrl=()=>{
    return topup;
}
exports.balanceUrl=()=>{
    return getcardbalance;
}
exports.fundtransferUrl=()=>{
    return fundtransfer;
}
exports.chnagePinUrl=()=>{
    return pinchange;
}
exports.paymentUrl=()=>{
    return doPayment;
}
exports.updateUserUrl=()=>{
    return updateUserInfo;
}
exports.getTransHistoryUrl=()=>{
    return gettranshistory;
}
exports.getTransHistoryAuthUrl=()=>{
    return gettranshistoryauth;
}
exports.addCardUrl=()=>{
    return addCard;
}
exports.getJobUrl=()=>{
    return getJobLevel;
}
exports.getJobSpecializationURL=()=>{
    return getJobSpecialization;
}
exports.getVertualCardURL=()=>{
    return getCustomVirtualCard;
}
//CASA
exports.getBankList=()=>{
    return banklist;
}
exports.getAccBankList=()=>{
    return bankAcclist;
}
exports.getAccEnroll=()=>{
    return bankeEnroll;
}


exports.getUploadBankDoc=()=>{
    return uploadBankDoc;
}
exports.getRemoveBankAcc=()=>{
    return removeBankAcc;
}
exports.getCasaFundTransfer=()=>{
    return casaFundTransfer;
}

exports.makeRequest = async (url, data) => {
    const requestData = {
        authtoken,
        timestamp,
        PID,
        uid,
        channel,
        cardtoken,
        amount,
        lrc
    };
    try {
        const response = await axios.post(url, data);
        return response.data;
    } catch (error) {
        console.error('Error:', error.response.data);
        throw error;
    }
};

exports.makePayment = async (url, data) => {
    const requestData = {
        authtoken,
        timestamp,
        PID,
        uid,
        channel,
        cardtoken,
        amount,
        lrc
    };
    try {

        const response = await axios.post(doPayment, requestData);
        return response.data;
    } catch (error) {
        console.error('Error:', error.response.data);
        throw error;
    }
};
exports.getLRC=(auth,obj,time,last="") =>{
    const delimiter = String.fromCharCode(30);
    const sep=delimiter;
    const display_sep="="

    const {addCountry,employer_name,province,...rest} =obj
   
    let DATA = this.rearrangeValues(rest,sep);
    let DISPLAY_ONLY = this.rearrangeValues(rest,display_sep);
    let msgdata=""
    let msgdata_DISPLAY=""
    if(last==""){
        if(DATA.length>0){
            msgdata= auth+sep+time+sep+pid+sep+DATA+sep;
            msgdata_DISPLAY= auth+display_sep+time+display_sep+pid+display_sep+DISPLAY_ONLY+display_sep;
        }else{
            msgdata= auth+sep+time+sep+pid+sep;
            msgdata= auth+sep+time+sep+pid+sep+DATA+sep;
            msgdata_DISPLAY= auth+display_sep+time+display_sep+pid+display_sep;
        }
        
        
    }else{
        if(DATA.length>0){
            msgdata= auth+sep+time+sep+pid+sep+DATA+sep+last+sep;
            msgdata_DISPLAY= auth+display_sep+time+display_sep+pid+display_sep+DISPLAY_ONLY+display_sep+last+display_sep;
        }else{
            msgdata= auth+sep+time+sep+pid+sep+last+sep;
            msgdata= auth+sep+time+sep+pid+sep+DATA+sep+last+sep;
            msgdata_DISPLAY= auth+display_sep+time+display_sep+pid+display_sep+last+display_sep;
        }


        
    }
    console.log(replaceAll(msgdata_DISPLAY,display_sep,sep)==msgdata)
    console.log("=======")
    console.log(msgdata)
    console.log(msgdata_DISPLAY)
    console.log("=======")
    console.log("===Z+====")
    console.log(msgdata)
    console.log(replaceAll(msgdata_DISPLAY,display_sep,sep))
    console.log("====Z===")
    let lrc = msgdata.charCodeAt(0);
    let returnHexCode = "";

    for (let i = 1; i < msgdata.length; i++) {
        lrc ^= msgdata.charCodeAt(i);
    }

    returnHexCode = lrc.toString(16).toUpperCase();

    if (returnHexCode.length === 1) {
        returnHexCode = "0" + returnHexCode;
    }

    return returnHexCode;
}
exports.getLRC2=(auth,time,last="") =>{
    const delimiter = String.fromCharCode(30);
    const sep=delimiter;
    const display_sep="="

   
    let msgdata= auth+sep+time+sep+pid+sep
    let lrc = msgdata.charCodeAt(0);
    let returnHexCode = "";

    for (let i = 1; i < msgdata.length; i++) {
        lrc ^= msgdata.charCodeAt(i);
    }

    returnHexCode = lrc.toString(16).toUpperCase();

    if (returnHexCode.length === 1) {
        returnHexCode = "0" + returnHexCode;
    }

    return returnHexCode;
}

exports.generateAuthToken=(body,time,last="")=>{
    const {addCountry,employer_name,province,...rest} =body
   // console.log(rest)
    //console.log("#####00#####")
    const body1= this.rearrangeValues(rest);
    //console.log(body1)
    let step1 =pid+partner_key+time+body1
    if(last!=""){
        step1 =pid+partner_key+time+body1+last
    }
   console.log("#####V#####")
    console.log(step1)
    const SHScode= this.generateSHA256Hash(step1);
    console.log(SHScode)
   // console.log("######2####")
    return SHScode;
}
exports.generateAuthToken2=(body,time,last="")=>{
    const keys = Object.keys(body);
    const body1 = keys.map(key => {
        return body[key];
       
  
      }).join("");
      console.log(body1)
    let step1 =pid+partner_key+time+body1
    if(last!=""){
        step1 =pid+partner_key+time+body1+last
    }
   //console.log("#####V#####")
    //console.log(step1)
    const SHScode= this.generateSHA256Hash(step1);
    console.log(SHScode)
   // console.log("######2####")
    return SHScode;
}
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}
exports.rearrangeValues=(obj,join="")=> {
    // Get the keys and sort them alphabetically
    const keys = Object.keys(obj).sort();
  
    // Concatenate the values according to the sorted keys
    const rearrangedValues = keys.map(key => {
      return obj[key];
     

    }).join(join);
  
    return rearrangedValues;
  }

  exports.generateSHA256Hash=(value)=> {
    
    return crypto.createHash('sha256').update(value).digest('hex').toUpperCase();
  }


  exports.register = async ( data,token) => {
    const formParams = new URLSearchParams(data);
    try {
        console.log(formParams)
       
        const response = await axios.post(register, formParams,
            {
                headers: {
               // 'X-API-Key':partner_key,
                //'Authorization' :'Bearer '+partner_key,
                'Content-Type': 'application/x-www-form-urlencoded'
                }
              }
        );
        return response.data;
        
        //await delay(1000);
       // return success;
    } catch (error) {
        console.error('Error:', error.response.data);
        throw error;
    }
};

exports.post = async (url, data) => {
    const formParams = new URLSearchParams(data);
    try {
      const {idImgString,selfieImgString,...exclude}=data
       console.log({idImgString:"",selfieImgString:"",...exclude})
       console.log(url)
        const response = await axios.post(url, formParams,
            {
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                }
              }
        );
        return response.data;
        
    } catch (error) {
        console.error('Error:', error.response.data);
        throw error;
    }
};