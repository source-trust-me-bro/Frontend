// Production server that uses several CPU cores.
//
//   pnpm build
//   pnpm start:cluster                       # one worker per 4 logical cores (at most 8)
//   pnpm start:cluster -- --workers 12 --port 3000
//
// `next dev` and `next start` each run on one core. This starts one Next.js server per worker
// and lets Node's cluster module share a single port between them, so requests are spread over
// the cores. A worker that crashes is replaced. Options are flags, not environment variables:
// the app's configuration stays the three variables in src/lib/server/env.ts.

import cluster from "node:cluster";
import http from "node:http";
import os from "node:os";
import process from "node:process";

function flag(name, fallback) {
  const at = process.argv.indexOf(`--${name}`);

  return at !== -1 && process.argv[at + 1] ? process.argv[at + 1] : fallback;
}

const port = Number(flag("port", "3000"));
const hostname = flag("host", "0.0.0.0");
const cores = os.availableParallelism();
const workers = Math.max(1, Number(flag("workers", Math.min(8, Math.max(2, Math.floor(cores / 4))))));

if (cluster.isPrimary) {
  cluster.schedulingPolicy = cluster.SCHED_RR; // spread connections evenly, on Windows too

  console.log(`KalevaShorts: ${workers} workers on ${cores} logical cores, http://localhost:${port}`);

  for (let index = 0; index < workers; index += 1) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.error(`worker ${worker.process.pid} stopped (${signal ?? code}); starting another`);
    cluster.fork();
  });

  const stop = () => {
    for (const worker of Object.values(cluster.workers ?? {})) {
      worker?.kill();
    }
    process.exit(0);
  };

  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
} else {
  const { default: next } = await import("next");
  const app = next({ dev: false, hostname, port });
  const handle = app.getRequestHandler();

  await app.prepare();

  http
    .createServer((request, response) => {
      handle(request, response);
    })
    .listen(port, hostname);
}
