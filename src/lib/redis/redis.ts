import Redis from "ioredis";

if (!process.env.REDIS_URL) {
  throw new Error("Redis URL is missing");
}

const redisClient = new Redis(process.env.REDIS_URL, {
  enableOfflineQueue: false,
});

export default redisClient;
