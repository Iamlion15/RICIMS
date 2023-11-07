const jwt=require("jsonwebtoken")
const dotenv=require("dotenv").config();

const generate_Token=(email)=>{
    const token=jwt.sign(
        {email},
        process.env.TOKEN_SECRET,{
            expiresIn:"2h"
        }
    )
    return token
}


module.exports=generate_Token;