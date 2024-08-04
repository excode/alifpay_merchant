const request = require('supertest')
const app = require('../server')
const userInfo = require('./userInfo')
describe('END-POINT ownerdetails', () => {
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
it("POST '/ownerdetails/'", async () => {
    const res = await request(app)
    .post('/ownerdetails')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "name":"incididunt",
"contactnumber":"601721906945",
"email":"adipisicing@ucode.ai8",
"icno":"officia8",
"icfrontimage":"",
"icbackimage":""
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("POST '/ownerdetails/'", async () => {
    const res = await request(app)
    .post('/ownerdetails')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "name":"aute",
"contactnumber":"601729532359",
"email":"labore@ucode.ai4",
"icno":"aliqua1",
"icfrontimage":"",
"icbackimage":""
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("GET '/ownerdetails/'", async () => {
    const res = await request(app)
    .get('/ownerdetails?name=incididunt&contactnumber=6017219069&email=adipisicin&icno=officia8&icfrontimage=&icbackimage=')
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
    
})

it("GET '/ownerdetails/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .get('/ownerdetails/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
}else{
    console.log("**GET[ID] TEST HAS BEEN SKIPED")
}
    
})
it("PATCH '/ownerdetails/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .patch('/ownerdetails/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "name":"nonclf",
"contactnumber":"601744793603",
"email":"commodo@ucode.ai2",
"icno":"idclf4",
"icfrontimage":"",
"icbackimage":""
    })
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**PATCH TEST HAS BEEN SKIPED")
    }
})

it("DELETE '/ownerdetails/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .delete('/ownerdetails/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**DELETE TEST HAS BEEN SKIPED")
    }
})

})
  
