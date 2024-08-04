const request = require('supertest')
const app = require('../server')
const userInfo = require('./userInfo')
describe('END-POINT bank', () => {
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
it("POST '/bank/'", async () => {
    const res = await request(app)
    .post('/bank')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "bank_id":"1",
"bank_name":"eaclf",
"bank_logo_url":"https://ucode.ai"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("POST '/bank/'", async () => {
    const res = await request(app)
    .post('/bank')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "bank_id":"1",
"bank_name":"voluptate",
"bank_logo_url":"https://excode.net"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("GET '/bank/'", async () => {
    const res = await request(app)
    .get('/bank?bank_id=1&bank_name=eaclf&bank_logo_url=https://uc')
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
    
})

it("GET '/bank/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .get('/bank/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
}else{
    console.log("**GET[ID] TEST HAS BEEN SKIPED")
}
    
})
it("PATCH '/bank/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .patch('/bank/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "bank_id":"1",
"bank_name":"velit",
"bank_logo_url":"https://ucode.ai"
    })
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**PATCH TEST HAS BEEN SKIPED")
    }
})

it("DELETE '/bank/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .delete('/bank/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**DELETE TEST HAS BEEN SKIPED")
    }
})

})
  
