// function to send jwt token
const sendJwtToken = (user, statusCode, res) => {

    // call function to get token
    const token = user.getJwtToken();

    // cookie option
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000            
        ),
        httpOnly: true,
        sameSite: 'None',
        secure: false
    }

    return res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user
    })
}

// export function
module.exports = sendJwtToken;