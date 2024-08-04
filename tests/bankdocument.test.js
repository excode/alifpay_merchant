const request = require('supertest')
const app = require('../server')
const userInfo = require('./userInfo')
describe('END-POINT bankdocument', () => {
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
it("POST '/bankdocument/'", async () => {
    const res = await request(app)
    .post('/bankdocument')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "acc_no":"nostrud",
"bankimgname":"exclf",
"bankimgstring":"Adipisicing qui proident culpa sunt sit mollit et aliqua reprehenderit duis anim.",
"uid":"idclf"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("POST '/bankdocument/'", async () => {
    const res = await request(app)
    .post('/bankdocument')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "acc_no":"mollit",
"bankimgname":"veniam",
"bankimgstring":"Est mollit proident laboris est aliqua nostrud occaecat elit nisi sit veniam cupidatat pariatur incididunt.",
"uid":"voluptate"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("GET '/bankdocument/'", async () => {
    const res = await request(app)
    .get('/bankdocument?acc_no=nostrud&bankimgname=exclf&bankimgstring=Adipisicin&uid=idclf')
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
    
})

it("GET '/bankdocument/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .get('/bankdocument/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
}else{
    console.log("**GET[ID] TEST HAS BEEN SKIPED")
}
    
})
it("PATCH '/bankdocument/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .patch('/bankdocument/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "acc_no":"duis",
"bankimgname":"aute",
"bankimgstring":"Labore nostrud duis elit.",
"uid":"velit"
    })
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**PATCH TEST HAS BEEN SKIPED")
    }
})

it("DELETE '/bankdocument/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .delete('/bankdocument/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**DELETE TEST HAS BEEN SKIPED")
    }
})

})
  
