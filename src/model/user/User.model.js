const { model } = require("mongoose");
const { UserSchema } = require("./User.schema")

const insertUser = (userObject) => {
    /*   UserSchema(userObject)
      .save()
      .then((data) =>console.log(data)) 
      .catch((error) => console.log(error)); */
    return new Promise((resolve, reject) => {
        UserSchema(userObject)
            .save()
            .then(data => resolve(data))
            .catch((error) => reject(error));
    });
}

module.exports = {
    insertUser,
}