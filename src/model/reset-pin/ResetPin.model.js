const { model } = require("mongoose");
const { ResetPinSchema } = require("./ResetPin.schema")
const{randomPinNumber}= require("../../utils/randomGenerator")
const setPasswordResetPin = (email) => {
   const pinLength=6
   const randomPin= randomPinNumber(pinLength);
   const resetObj={
    email,
    pin:randomPin
   }
    return new Promise((resolve, reject) => {
      ResetPinSchema(resetObj)
            .save()
            .then(data => resolve(data))
            .catch((error) => reject(error));
    });
}


module.exports = {
  setPasswordResetPin,
}