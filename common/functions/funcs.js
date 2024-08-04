exports.getNowUTC = (deductSecends=0) => {
    var now = new Date;
    var utc_timestamp = Date.UTC(now.getFullYear(),now.getMonth(), now.getDate() , 
    now.getHours(), now.getMinutes(), now.getSeconds()-deductSecends, now.getMilliseconds());

    return utc_timestamp;
};
exports.getTime =()=> {
  return new Date();
};
exports.addDays =(utc_date,daysToAdd)=> {
  var date=new Date(utc_date);
  var _24HoursInMilliseconds = 86400000;
  return new Date(date.getTime() + daysToAdd * _24HoursInMilliseconds);
};
exports.getDaysAgoUTC = (utc_date,days=0) => {
  var ago = this.addDays(utc_date,days)
  var utc_timestamp = Date.UTC(ago.getFullYear(),ago.getMonth(), ago.getDate() , 
  ago.getHours(), ago.getMinutes(), ago.getSeconds(), ago.getMilliseconds());

  return utc_timestamp;
};
exports.randomText =(length)=> {
  var result           = '';
  //var characters       = 'abcdefghjklmnpqrstuvwxyz0123456789';
  var characters       = '0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
exports.handleValidationError=(err, consoleLog = false)=>{
    const messages = []
    console.log("########");
    console.log(err);
    for (let field in err.errors) {
      messages.push(err.errors[field].message)
      consoleLog && console.log(err.errors[field].message)
    }
    //res.status(422).send({ messages })
    return messages.join(",");
  };


exports.randomNumber=(length)=>{
  //return "123456";
  return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
};


exports.getCurrentDateTime=()=> {
  const now = new Date();
  const year = now.getFullYear().toString();
  let month = (now.getMonth() + 1).toString();
  let day = now.getDate().toString();
  let hours = now.getHours().toString();
  let minutes = now.getMinutes().toString();
  let seconds = now.getSeconds().toString();

  // Add leading zeros if needed
  month = month.length === 1 ? '0' + month : month;
  day = day.length === 1 ? '0' + day : day;
  hours = hours.length === 1 ? '0' + hours : hours;
  minutes = minutes.length === 1 ? '0' + minutes : minutes;
  seconds = seconds.length === 1 ? '0' + seconds : seconds;

  return year + month + day + hours + minutes + seconds;
}
exports.null2empty=(value)=>{

  return value?value:"";

}