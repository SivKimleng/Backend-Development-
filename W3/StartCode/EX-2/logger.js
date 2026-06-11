function logger(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log('Query:', req.query);
    next();
}

export default logger;
