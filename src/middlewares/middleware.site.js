const jwt = require("jsonwebtoken")

const verifySessionJWT = (req, res, next) => {   
    if (!req.cookies) return res.redirect("/signin");
        
    jwt.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.redirect("/signin");
            req.user = {
                _id: decoded._id,
            };
            next();
        })
}

module.exports = verifySessionJWT;