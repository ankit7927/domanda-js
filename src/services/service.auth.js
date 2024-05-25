const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const errorGen = require("../utilities/errorGen");
const modelUser = require("../models/model.user");


const authService = {}

authService.signin = async (email, password) => {
    const existingUser = await modelUser.findOne({ email: email })
        .select("password")
        .lean().exec()

    if (!existingUser) errorGen('email not found', 404);

    const passwordMatch = bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) errorGen('wrong password', 401);

    const accesToken = jwt.sign(
        {
            _id: existingUser._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
    )

    const refreshToken = jwt.sign(
        {
            _id: existingUser._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    return { accesToken, refreshToken, userId: existingUser._id };
}

authService.refreshToken = async (refreshToken) => {
    jwt.verify(refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) errorGen('forbidden', 403);

            const user = await modelUser.findOne({ _id: decoded._id }).exists().lean().exec()

            if (!user) errorGen('Unauthorized', 401);

            const accessToken = jwt.sign(
                {
                    _id: decoded._id
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1d' }
            )

            return accessToken;
        })
}

module.exports = authService;