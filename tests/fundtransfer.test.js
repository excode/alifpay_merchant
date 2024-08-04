const request = require('supertest')
const app = require('../server')
const userInfo = require('./userInfo')
describe('END-POINT fundtransfer', () => {
let newID="";
var auth = {accessToken:""};

it("Login", async () => {
const login = await request(app)
    .post('/auth')
    .send({
        email: userInfo.email,
        password: userInfo.password
    });
    if(login.statusCode==201){
        auth = login.body;
        console.log(auth.accessToken);
    }
    expect(login.statusCode).toEqual(201)
})      
it("POST '/fundtransfer/'", async () => {
    const res = await request(app)
    .post('/fundtransfer')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "amount":"1.35",
"sourceaccount":"euclf",
"transfer_in_reference_id":"exclf",
"sourceaccounttokenize":"veniam",
"transfer_out_reference_id":"irure",
"servicecharges":"1.35",
"gst":"1.35",
"destinationbankaccount":"magna",
"trx_date":"2023-05-07",
"bankid":"1.35",
"cardpin":"1",
"reference":"occaecat"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("POST '/fundtransfer/'", async () => {
    const res = await request(app)
    .post('/fundtransfer')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "amount":"1.35",
"sourceaccount":"pariatur",
"transfer_in_reference_id":"duis",
"sourceaccounttokenize":"inclf",
"transfer_out_reference_id":"reprehenderit",
"servicecharges":"1.35",
"gst":"1.35",
"destinationbankaccount":"consectetur",
"trx_date":"2023-05-07",
"bankid":"1.35",
"cardpin":"1",
"reference":"euclf"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("GET '/fundtransfer/'", async () => {
    const res = await request(app)
    .get('/fundtransfer?amount=1.35&sourceaccount=euclf&transfer_in_reference_id=exclf&sourceaccounttokenize=veniam&transfer_out_reference_id=irure&servicecharges=1.35&gst=1.35&destinationbankaccount=magna&trx_date=2023-05-07&bankid=1.35&cardpin=1&reference=occaecat')
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
    
})

it("GET '/fundtransfer/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .get('/fundtransfer/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
}else{
    console.log("**GET[ID] TEST HAS BEEN SKIPED")
}
    
})
it("PATCH '/fundtransfer/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .patch('/fundtransfer/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "amount":"1.35",
"sourceaccount":"inclf",
"transfer_in_reference_id":"aliquip",
"sourceaccounttokenize":"magna",
"transfer_out_reference_id":"velit",
"servicecharges":"1.35",
"gst":"1.35",
"destinationbankaccount":"pariatur",
"trx_date":"2023-05-07",
"bankid":"1.35",
"cardpin":"1",
"reference":"esse"
    })
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**PATCH TEST HAS BEEN SKIPED")
    }
})

it("DELETE '/fundtransfer/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .delete('/fundtransfer/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**DELETE TEST HAS BEEN SKIPED")
    }
})

})
  
