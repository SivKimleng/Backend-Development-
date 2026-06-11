function validateQuery(req, res, next) {
    const { minCredits, maxCredits } = req.query;
    const parsedMinCredits = minCredits !== undefined ? Number(minCredits) : undefined;
    const parsedMaxCredits = maxCredits !== undefined ? Number(maxCredits) : undefined;

    if (
        (minCredits !== undefined && !Number.isInteger(parsedMinCredits)) ||
        (maxCredits !== undefined && !Number.isInteger(parsedMaxCredits))
    ) {
        return res.status(400).json({
            error: 'minCredits and maxCredits must be valid integers.'
        });
    }

    if (
        parsedMinCredits !== undefined &&
        parsedMaxCredits !== undefined &&
        parsedMinCredits > parsedMaxCredits
    ) {
        return res.status(400).json({
            error: 'Invalid credit range. minCredits cannot be greater than maxCredits.'
        });
    }

    req.validatedCredits = {
        minCredits: parsedMinCredits,
        maxCredits: parsedMaxCredits
    };

    next();
}

export default validateQuery;
