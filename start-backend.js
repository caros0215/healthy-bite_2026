// start-backend.js
const waitPort = require("wait-port");
const { exec } = require("child_process");

const mysqlPort = 3307;
const timeout = 30000; // máximo 30 segundos

(async () => {
  console.log("⏳ Esperando a que MySQL esté listo...");
  const open = await waitPort({ host: "127.0.0.1", port: mysqlPort, timeout });

  if (open) {
    console.log("✅ MySQL listo, arrancando backend...");
    const child = exec("npm --prefix backend start", (err, stdout, stderr) => {
      if (err) console.error("Error backend:", err);
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
    });

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  } else {
    console.error(`❌ MySQL no respondió en ${timeout / 1000} segundos`);
    process.exit(1);
  }
})();