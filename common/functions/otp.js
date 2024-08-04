const UserModel = require('../../src/users/users.model');
const AccountModel = require('../../src/accounts/accounts.model');
const MerchantModel = require('../../src/merchantinfo/merchantinfo.model');
const BankAccountModel = require('../../src/bankaccount/bankaccount.model');
const OwnerModel = require('../../src/ownerDetails/ownerDetails.model');
//const TransferModel = require('../../src/transfer/transfer.model');
const funcs =  require("../../common/functions/funcs");
const email =  require("../../common/functions/email");
const { use } = require('../../server');

exports.sendOTP =async (user,FP=0)=>{
    //console.log(user)
    const password= user.username=="kalam"?"112233": funcs.randomNumber(6);
    //console.log("AAA")
    var emailContent="Your AlifPay  Email OTP is "+password
    if(FP==1){
        emailContent="Your AlifPay  password change code is "+password
    }
    console.log("OTP:"+password)    ;         
    await UserModel.updateOTP(user.userId,password);
    //console.log("ccc")         
    const contents={
        name: user.name,
        product_name: "AlifPay.com.my",
        content:emailContent,
        product_url:""
    };
   
  await email.sendEmail(user.email,"alif_pay",contents);

}

exports.sendWelcome =async (user,Password)=>{
    const contents={
        name: user.name,
        product_name: "AlifPay.com.my",
        username:user.username,
        password:Password
     };
    try{
    await email.sendEmail(user.email,"alif_pay_welcome",contents);
    }catch(ee){
        console.log(ee)
    }          
    
    }

    exports.sendChangePassword =async (user,Password)=>{
        const contents={
            name: user.name,
            product_name: "AlifPay.com.my",
            username:user.username,
            password:Password
         };
        try{
        await email.sendEmail(user.email,"alif_pay_changepassowrd_email",contents);
        }catch(ee){
            console.log(ee)
        }          
        
        }
    


    exports.sendTransferOTP =async (user,transfer)=>{
        console.log(user)
        const password= funcs.randomNumber(6);
       // await TransferModel.updateOTP(transfer.id,password);
       
        const contents={
            name: user.name,
            product_name: "AlifPay.com.my",
            amount:transfer.amount,
            otp:password,
            accountto:transfer.accountto
        };
       
    await email.sendEmail(user.email,"alif_pay_transfer",contents);
    
    }


    exports.sendTransactionEmail =async (user,transaction)=>{
        console.log(user)
        const password= funcs.randomNumber(6);
        
       
        const contents={
            name: user.name,
            product_name: "AlifPay.com.my",
            amount:transaction.amount,
            transaction_type:transaction.transaction_type,
            Particular:transaction.particular
        };
       
    await email.sendEmail(user.email,"alif_pay_transaction",contents);
    
    }


    exports.sendMerchantApplication =async (req)=>{
       const user = req.jwt;
       const merchantEmail = user.email;
        console.log(user)
        const url="http://localhost:8080/";
        const merchant =req.body.merchant ;  ///await MerchantModel.findByEmail2(merchantEmail);
        const bankAccounts = req.body.bankAccounts; //await BankAccountModel.listAll({createby:merchantEmail});
        const owners = req.body.owners// bankAccounts await OwnerModel.listAll({createby:merchantEmail});
        const files = require("../../lib/files");
        console.log(merchant)
        let merchantDocuments=[]
        let merchantBankAccount=[]
        let ownerDetails=[]
        for(var f=0;f<files.length;f++){
            let file = files[f];
            let fileObj={doctype:file.title}
            if(merchant[file.field]!='' && merchant[file.field]!=undefined){
                fileObj["uploaded"]="Yes"
                if(merchant[file.field].match(/.(jpg|jpeg|png|gif)$/i)){
                    fileObj["image"] = url+merchant[file.field];

                }else{
                    fileObj["file"] = url+merchant[file.field];
                }

            }
            merchantDocuments.push(fileObj);
            

        }
        for(var b=0;b<bankAccounts.length;b++){
            let bank = bankAccounts[b];
            let bankObj={...bank,account_type:bank.acctype_id==1.00?"Saving":"Current"}
            if(bank.doc!='' && bank.doc!=undefined){
               
                if(bank.doc.match(/.(jpg|jpeg|png|gif)$/i)){
                    bankObj["image"] = url+bank.doc;

                }else{
                    bankObj["file"] = url+bank.doc;
                }

            }
            merchantBankAccount.push(bankObj);
        }
        for(var o=0;o<owners.length;o++){
            let owner = owners[o];
            let ownerObj={...owner}
            if(owner.icfrontimage!='' && owner.icfrontimage!=undefined){
               
                if(owner.icfrontimage.match(/.(jpg|jpeg|png|gif)$/i)){
                    ownerObj["image1"] = url+owner.icfrontimage;

                }else{
                    ownerObj["file1"] = url+owner.icfrontimage;
                }

            }
            if(owner.icbackimage!='' && owner.icbackimage!=undefined){
               
                if(owner.icbackimage.match(/.(jpg|jpeg|png|gif)$/i)){
                    ownerObj["image2"] = url+owner.icbackimage;

                }else{
                    ownerObj["file2"] = url+owner.icbackimage;
                }

            }
            ownerDetails.push(ownerObj);
        }

        const contents={
            name: user.name,
            product_name: "AlifPay.com.my",
            contact_person:merchant.contactperson,
            mobile_no:merchant.mobileno,
            email:merchant.email,
            street:merchant.street,
            address:merchant.address,
            city:merchant.city, 
            state:merchant.state,
            country:merchant.country,
            postcode:merchant.postcode,
            avg_transaction:merchant.avgtransaction,
            avg_monthly_transaction:merchant.avgmonthlytransaction,
            documents:merchantDocuments,
            bank_account:merchantBankAccount,
            owners:ownerDetails
        };
       console.log(contents)
      // return contents
      await email.sendEmail(user.email,"alif_pay_merchant",contents);
      return contents
    
    }