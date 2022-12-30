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

const getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        if (!email) return false;

        try {
            UserSchema.findOne({ email }, (error, data) => {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                resolve(data);
            });
        } catch (error) {
            reject(error);
        }
    });
};


module.exports = {
    insertUser,
    getUserByEmail
}