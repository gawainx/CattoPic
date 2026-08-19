/** Generates the ignored Worker configuration from the user-managed root .env.local file. */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parse } from 'dotenv';

const rootDirectory = process.cwd();
const envPath = resolve(rootDirectory, '.env.local');
const workerConfigPath = resolve(rootDirectory, 'worker/wrangler.toml');
const values = parse(await readFile(envPath));
const existingConfig = await readFile(workerConfigPath, 'utf8').catch(() => '');
const requiredKeys = [
  'CATTOPIC_WORKER_NAME',
];
const missingKeys = requiredKeys.filter((key) => !values[key] || values[key].startsWith('replace-with-'));

if (missingKeys.length > 0) {
  throw new Error(`Complete these values in .env.local before generating the Worker configuration: ${missingKeys.join(', ')}`);
}

/**
 * Encodes a string as a TOML basic string.
 *
 * @param {string} value - The configuration value to encode.
 * @returns {string} A TOML-safe string literal.
 */
const tomlValue = (value) => JSON.stringify(value);
const useQueue = values.CATTOPIC_USE_QUEUE === 'true';
const queueConfiguration = useQueue
  ? `\n[[queues.producers]]\nqueue = ${tomlValue(`${values.CATTOPIC_WORKER_NAME}-delete-queue`)}\nbinding = "DELETE_QUEUE"\n\n[[queues.consumers]]\nqueue = ${tomlValue(`${values.CATTOPIC_WORKER_NAME}-delete-queue`)}\nmax_batch_size = 10\nmax_batch_timeout = 5\n`
  : '';
const generatedConfig = `name = ${tomlValue(values.CATTOPIC_WORKER_NAME)}
main = "src/index.ts"
compatibility_date = "2025-12-10"
compatibility_flags = ["nodejs_compat"]

[vars]
ENVIRONMENT = "production"
R2_PUBLIC_URL = ${tomlValue(values.CATTOPIC_R2_PUBLIC_URL || '')}
USE_QUEUE = ${tomlValue(String(useQueue))}

[images]
binding = "IMAGES"

[[r2_buckets]]
binding = "R2_BUCKET"

[[d1_databases]]
binding = "DB"

[[kv_namespaces]]
binding = "CACHE_KV"
${queueConfiguration}
[triggers]
crons = ["0 * * * *"]

[dev]
port = 8787
local_protocol = "http"

[observability]
[observability.logs]
enabled = true
head_sampling_rate = 1
invocation_logs = true
persist = true
`;
const config = existingConfig
  ? existingConfig
    .replace(/^name = .+$/m, `name = ${tomlValue(values.CATTOPIC_WORKER_NAME)}`)
    .replace(/^R2_PUBLIC_URL = .+$/m, `R2_PUBLIC_URL = ${tomlValue(values.CATTOPIC_R2_PUBLIC_URL || '')}`)
    .replace(/^USE_QUEUE = .+$/m, `USE_QUEUE = ${tomlValue(String(useQueue))}`)
  : generatedConfig;

await writeFile(workerConfigPath, config);
console.log(`${existingConfig ? 'Updated' : 'Generated'} ${workerConfigPath}`);
