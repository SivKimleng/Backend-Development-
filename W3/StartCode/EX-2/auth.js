const API_TOKEN = 'xyz123';

function auth(req, res, next) {
    const { token } = req.query;

    if (token !== API_TOKEN) {
        return res.status(401).json({
            error: 'Unauthorized. A valid token query parameter is required.'
        });
    }

    next();
}

export default auth;
