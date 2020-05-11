module.exports = function jsonResponse(body) {
    return {
        statusCode: 200,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': process.env.CORS_ORIGIN
        }
    };
};
