"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, _req, res, _next) {
    console.error('Unhandled error:', err.message);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
    });
}
//# sourceMappingURL=errorHandler.js.map