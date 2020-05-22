module.exports  = {
    signOptions: {
        issuer:  "contact-form-api-sumuk",
        expiresIn:  "24h",
        algorithm:  "RS512"
    },
    verifyOptions: {
        issuer:  "contact-form-api-sumuk",
        expiresIn:  "24h",
        algorithm:  ["RS512"]
       }
}