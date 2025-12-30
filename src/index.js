import { createConsole } from "@evolu/common";
import { createNodeJsRelay } from "@evolu/nodejs";
import { mkdirSync } from "fs";

const PORT = parseInt(process.env.PORT || "4000", 10);
const QUOTA_MB = parseInt(process.env.QUOTA_MB || "10", 10);
const ENABLE_LOGGING = process.env.ENABLE_LOGGING === "true";

const maxBytes = QUOTA_MB * 1024 * 1024;

console.log(`Starting Evolu Relay...`);
console.log(`  Port: ${PORT}`);
console.log(`  Quota per owner: ${QUOTA_MB}MB (${maxBytes} bytes)`);
console.log(`  Logging: ${ENABLE_LOGGING ? "enabled" : "disabled"}`);

mkdirSync("data", { recursive: true });
process.chdir("data");

const relay = await createNodeJsRelay({
  console: createConsole(),
})({
  port: PORT,
  enableLogging: ENABLE_LOGGING,
  isOwnerWithinQuota: (_ownerId, requiredBytes) => requiredBytes <= maxBytes,
});

if (relay.ok) {
  console.log(`Evolu Relay started on port ${PORT}`);
  process.once("SIGINT", relay.value[Symbol.dispose]);
  process.once("SIGTERM", relay.value[Symbol.dispose]);
} else {
  console.error("Failed to start:", relay.error);
  process.exit(1);
}
