const config = {
    host : "http://localhost:3000",
    dbURI : "mongodb+srv://admin:a123456@my-cluster-tjcf3.mongodb.net/mychatcatdb?retryWrites=true&w=majority",
    sessionSecret: "catscanfly",
    fb: {
        clientID: "217311012967930",
        clientSecret: "ce79e46487d50d161d7cbe812e0947a6",
        callbackURL: "//localhost:3000/auth/facebook/callback",
        profileFields: ["id", "displayName", "photos"]
    },
    google: {
        clientID: "71545783625-fu4b211u0to0pt45k7lefct4n6gc8tea.apps.googleusercontent.com",
        clientSecret: "wxdpDsf-ii6mEe199a73Z8FM",
        callbackURL: "//localhost:3000/auth/google/callback",
    },
    redis: {
        host: "127.0.0.1",
        port: "6379",
        password: ""
    }

}
export default config;