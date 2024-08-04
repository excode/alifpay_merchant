exports.mergeStrings=(a, b)=>{
    var result = '';
    var maxLength = Math.max(a.length, b.length);
    for (var i = 0; i < maxLength; i++) {
      if (i < a.length) {
        result += a[i];
      }
      if (i < b.length) {
        result += b[i];
      }
    }
    
    return result+"."+encrypt(a.length.toString(),8);
  }  
  exports.reverseMerge=(mergedString)=>{
    var parts = mergedString.split('.'); // Split the string into an array using dot as delimiter
    //var lastPart = parts[parts.length - 1];
    var lastPart = parts.pop();
    var dLastPart = decrypt(lastPart,8);
  // Join the remaining parts back together using dot as delimiter
    var result = parts.join('.');
    let maxLength = parseInt(dLastPart);
    var a = '';
    var b = '';
    for (var i = 0; i < result.length; i++) {
     // if (i % 2 === 0 && (a.length-numLength)<maxLength) {
      if (i % 2 === 0 && a.length <maxLength) {
        a += mergedString[i];
      } else {
        b += mergedString[i];
      }
    }
    
    return { a: a, b: b };
  }
  
  function encrypt(text, shift) {
      let result = '';
      for (let i = 0; i < text.length; i++) {
          let charCode = text.charCodeAt(i);
          // Check if character is a digit (ASCII 48-57)
          if (charCode >= 48 && charCode <= 57) {
              // Shift the digit by the specified amount
              let encryptedDigit = (parseInt(text[i]) + shift) % 10;
              result += encryptedDigit.toString();
          } else {
              result += text[i]; // Leave non-digit characters unchanged
          }
      }
      return result;
  }
  
  // Decryption function
  function decrypt(text, shift) {
      return encrypt(text, 10 - shift); // Decryption is essentially encryption with the reverse shift
  }