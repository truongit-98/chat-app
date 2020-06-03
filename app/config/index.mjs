import Config from "../config/config.mjs";

var config;
if (process.env.NODE_ENV === 'production') {
    // Offer production stage environment variables
    // process.env.REDIS_URL :: redis://redistogo:d99d16b16b040428cccbc6a0c6810afe@cobia.redistogo.com:9899/
    let redisURI = require('url').parse(process.env.REDIS_URL);
    console.log(redisURI);
    let redisPassword = redisURI.auth.split(':')[1];
    config = {
        host: process.env.host || 3000,
        dbURI: process.env.dbURI,
        sessionSecret: process.env.sessionSecret,
        fb: {
            clientID: process.env.fbClientID,
            clientSecret: process.env.fbClientSecret,
            callbackURL: process.env.host + "/auth/facebook/callback",
            profileFields: ["id", "displayName", "photos"]
        },
        redis: {
            host: redisURI.hostname,
            port: redisURI.port,
            password: redisPassword
        }
    }
} else {
    config = Config; 
}
export default config;