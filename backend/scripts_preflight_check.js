#!/usr/bin/env node
const net = require('net');

function checkModule(name) {
  try {
    require.resolve(name);
    return { ok: true, detail: 'installed' };
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
    socket.once('connect', () => finish(true, `reachable ${host}:${port}`));
    socket.once('timeout', () => finish(false, `timeout ${host}:${port}`));
    socket.once('error', (err) => finish(false, `${err.code || 'ERR'} ${host}:${port}`));
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

  const rows = [];
  rows.push({ name: 'node', ok: true, detail: process.version });
  rows.push({ name: 'module:ioredis', ...checkModule('ioredis') });

  if (mongo) {
    rows.push({ name: 'mongo:tcp', ...(await checkPort(mongo.host, mongo.port)) });
  } else {
    rows.push({ name: 'mongo:tcp', ok: false, detail: 'MONGO_URI missing/invalid' });
  }

  if (redis) {
    rows.push({ name: 'redis:tcp', ...(await checkPort(redis.host, redis.port)) });
  } else {
    rows.push({ name: 'redis:tcp', ok: false, detail: 'REDIS_URL missing/invalid' });
  }

  console.table(rows);
  const failed = rows.filter((r) => !r.ok).length;
  if (failed) process.exit(1);
})();