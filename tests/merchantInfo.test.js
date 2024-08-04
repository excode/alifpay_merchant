const request = require('supertest')
const app = require('../server')
const userInfo = require('./userInfo')
describe('END-POINT merchantinfo', () => {
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
it("POST '/merchantinfo/'", async () => {
    const res = await request(app)
    .post('/merchantinfo')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "contactperson":"duis",
"mobileno":"601727392266",
"email":"ullamco@ucode.ai0",
"street":"dolor",
"address":"Eu aliqua tempor velit non veniam.",
"city":"incididunt",
"state":"occaecat",
"postcode":"estclf",
"country":"quis",
"avgtransaction":"1.35",
"avgmonthlytransaction":"1.35",
"bankstatement":"",
"ssm":"",
"authorizationform":"",
"signboard":"",
"storeleftphoto":"",
"storerightphoto":"",
"workstation":"",
"productphoto1":"",
"productphoto2":"",
"productphoto3":""
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("POST '/merchantinfo/'", async () => {
    const res = await request(app)
    .post('/merchantinfo')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "contactperson":"occaecat",
"mobileno":"601788602712",
"email":"adipisicing@ucode.ai8",
"street":"consectetur",
"address":"Sit consectetur pariatur labore cupidatat exercitation ullamco elit amet occaecat fugiat in anim.",
"city":"eaclf",
"state":"irure",
"postcode":"deserunt",
"country":"sunt",
"avgtransaction":"1.35",
"avgmonthlytransaction":"1.35",
"bankstatement":"",
"ssm":"",
"authorizationform":"",
"signboard":"",
"storeleftphoto":"",
"storerightphoto":"",
"workstation":"",
"productphoto1":"",
"productphoto2":"",
"productphoto3":""
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("GET '/merchantinfo/'", async () => {
    const res = await request(app)
    .get('/merchantinfo?contactperson=duis&mobileno=6017273922&email=ullamco@uc&street=dolor&address=Eu aliqua &city=incididunt&state=occaecat&postcode=estclf&country=quis&avgtransaction=1.35&avgmonthlytransaction=1.35&bankstatement=&ssm=&authorizationform=&signboard=&storeleftphoto=&storerightphoto=&workstation=&productphoto1=&productphoto2=&productphoto3=')
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
    
})

it("GET '/merchantinfo/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .get('/merchantinfo/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
}else{
    console.log("**GET[ID] TEST HAS BEEN SKIPED")
}
    
})
it("PATCH '/merchantinfo/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .patch('/merchantinfo/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "contactperson":"dolor",
"mobileno":"601719278501",
"email":"id@ucode.ai5",
"street":"sitclf",
"address":"Quis veniam mollit aliqua ex do laboris nulla nulla.",
"city":"aliqua",
"state":"incididunt",
"postcode":"ullamco",
"country":"ipsum",
"avgtransaction":"1.35",
"avgmonthlytransaction":"1.35",
"bankstatement":"",
"ssm":"",
"authorizationform":"",
"signboard":"",
"storeleftphoto":"",
"storerightphoto":"",
"workstation":"",
"productphoto1":"",
"productphoto2":"",
"productphoto3":""
    })
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**PATCH TEST HAS BEEN SKIPED")
    }
})

it("DELETE '/merchantinfo/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .delete('/merchantinfo/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**DELETE TEST HAS BEEN SKIPED")
    }
})

})
  
