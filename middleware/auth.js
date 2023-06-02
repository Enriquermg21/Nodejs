const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');
const User = require('../modelos/usuarios');


const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorResponse('Debe iniciar sesion...', 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();

    } catch (error) {
        return next(new ErrorResponse('Debe iniciar sesion...', 401));
    }
}

module.exports = { isAuthenticated,routeDuration};