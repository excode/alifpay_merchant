const request = require('supertest')
const app = require('../server')
const userInfo = require('./userInfo')
describe('END-POINT bankaccount', () => {
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
it("POST '/bankaccount/'", async () => {
    const res = await request(app)
    .post('/bankaccount')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "acctype_desc":"incididunt",
"doc_status_id":"1",
"bank_id":"1",
"bank_name":"nostrud",
"acc_no":"sitclf",
"acctype_id":"1.35",
"bankinfo_id":"1",
"acc_desc":"nonclf",
"bank_logo_url":"https://mypaaa.com"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("POST '/bankaccount/'", async () => {
    const res = await request(app)
    .post('/bankaccount')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "acctype_desc":"adipisicing",
"doc_status_id":"1",
"bank_id":"1",
"bank_name":"elit",
"acc_no":"exclf",
"acctype_id":"1.35",
"bankinfo_id":"1",
"acc_desc":"eiusmod",
"bank_logo_url":"https://excode.net"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("GET '/bankaccount/'", async () => {
    const res = await request(app)
    .get('/bankaccount?acctype_desc=incididunt&doc_status_id=1&bank_id=1&bank_name=nostrud&acc_no=sitclf&acctype_id=1.35&bankinfo_id=1&acc_desc=nonclf&bank_logo_url=https://my')
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
    
})

it("GET '/bankaccount/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .get('/bankaccount/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
}else{
    console.log("**GET[ID] TEST HAS BEEN SKIPED")
}
    
})
it("PATCH '/bankaccount/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .patch('/bankaccount/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "acctype_desc":"anim",
"doc_status_id":"1",
"bank_id":"1",
"bank_name":"fugiat",
"acc_no":"commodo",
"acctype_id":"1.35",
"bankinfo_id":"1",
"acc_desc":"inclf",
"bank_logo_url":"https://excode.net"
    })
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**PATCH TEST HAS BEEN SKIPED")
    }
})

it("DELETE '/bankaccount/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .delete('/bankaccount/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**DELETE TEST HAS BEEN SKIPED")
    }
})

})
  
