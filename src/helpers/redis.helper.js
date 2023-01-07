const redis = require("redis");
const client = redis.createClient(process.env.REDIS_URL);
//redis://localhost:6379
client.on('error', (err) => console.log('Redis Client Error', err));
client.connect();

const setJWT =  (key, value) => {
    return new Promise(async(resolve, reject) => {
      try {
        const res= await client.set(key, value);//
        resolve(res);//
        /* return await client.set(key, value, (err, res) => {
          if (err) reject(err);
          resolve(res);
        }); */
      } catch (error) {
        reject(error);
      }
    });
  };
  
  const getJWT = (key) => {
    return new Promise(async(resolve, reject) => {
      try {
        const value = await client.get(key);
        resolve(value);
        /* client.get(key, (err, res) => {
          if (err) reject(err);
          resolve(res);
        }); */
      } catch (error) {
        reject(error);
      }
    });
  };

  const deleteJWT = (key) => {
    try {
      client.del(key);
    } catch (error) {
      console.log(error);
    }
  };

  module.exports = {
    setJWT,
    getJWT,
    deleteJWT
  };