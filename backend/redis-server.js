const Redis = require('ioredis');

const retryStrategy = (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
};

// Prefer a full connection URL (e.g. Render Key Value's REDIS_URL); otherwise
// fall back to host/port (defaults match the local redis-stack container).
const redis = process.env.REDIS_URL
    ? new Redis(process.env.REDIS_URL, { retryStrategy })
    : new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT, 10) || 6380,
        retryStrategy,
    });

function generateCacheKey(req, data) {
    const baseUrl = req.path
        .replace(/^\/+|\/+$/g, '')  // remove leading/trailing slashes
        .replace(/\//g, ':');       // convert slashes to colons

    return `${baseUrl}:${data}`;
}

module.exports = { redis, generateCacheKey };
