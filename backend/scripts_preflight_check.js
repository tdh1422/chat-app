#!/usr/bin/env node
const net = require("net");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, ".env") });

function checkModule(name) {
  try {
    require.resolve(name);
    return { ok: true, detail: "installed" };
  } catch (err) {
    return { ok: false, detail: err.code || err.message };
  }
}

function checkPort(host, port, timeoutMs = 1500) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let done = false;

    const finish = (ok, detail) => {
      if (done) return;
      done = true;
      socket.destroy();
      resolve({ ok, detail });
    };

    socket.setTimeout(timeoutMs);
    socket.once("connect", () => finish(true, `reachable ${host}:${port}`));
    socket.once("timeout", () => finish(false, `timeout ${host}:${port}`));
    socket.once("error", (err) => finish(false, `${err.code || "ERR"} ${host}:${port}`));
    socket.connect(port, host);
  });
}

function parseUrl(raw, fallbackPort) {
  if (!raw) return null;
  try {
    const u = new URL(raw);
    return { host: u.hostname, port: Number(u.port || fallbackPort) };
  } catch {
    return null;
  }
}

(async () => {
  const mongo = parseUrl(process.env.MONGO_URI, 27017);
  const redis = parseUrl(process.env.REDIS_URL, 6379);

  const modules = ["express", "mongoose", "ioredis", "socket.io", "bcryptjs", "jsonwebtoken"];

  const rows = [];
  rows.push({ name: "node", ok: true, detail: process.version });
  rows.push({ name: "env:MONGO_URI", ok: Boolean(process.env.MONGO_URI), detail: process.env.MONGO_URI ? "set" : "missing" });
  rows.push({ name: "env:REDIS_URL", ok: Boolean(process.env.REDIS_URL), detail: process.env.REDIS_URL ? "set" : "missing" });

  for (const mod of modules) {
    rows.push({ name: `module:${mod}`, ...checkModule(mod) });
  }

  if (mongo) {
    rows.push({ name: "mongo:tcp", ...(await checkPort(mongo.host, mongo.port)) });
  } else {
    rows.push({ name: "mongo:tcp", ok: false, detail: "MONGO_URI missing/invalid" });
  }

  if (redis) {
    rows.push({ name: "redis:tcp", ...(await checkPort(redis.host, redis.port)) });
  } else {
    rows.push({ name: "redis:tcp", ok: false, detail: "REDIS_URL missing/invalid" });
  }

  console.table(rows);
  const failed = rows.filter((r) => !r.ok).length;
  if (failed) {
    console.error(`\nPreflight failed: ${failed} check(s) are not ready.`);
    process.exit(1);
  }

  console.log("\nPreflight passed: backend dependencies and services are ready.");
})();