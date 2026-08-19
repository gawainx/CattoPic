/** Generates the ignored Worker configuration from the user-managed root .env.local file. */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parse } from 'dotenv';

const rootDirectory = process.cwd();
const envPath = resolve(rootDirectory, '.env.local');
const workerConfigPath = resolve(rootDirectory, 'worker/wrangler.toml');
const values = parse(await readFile(envPath));
const requiredKeys = [
  'CATTOPIC_WORKER_NAME',
  'CATTOPIC_R2_PUBLIC_URL',
  'CATTOPIC_R2_BUCKET_NAME',
  'CATTOPIC_D1_DATABASE_NAME',
  'CATTOPIC_D1_DATABASE_ID',
  'CATTOPIC_KV_NAMESPACE_ID',
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
const config = `name = ${tomlValue(values.CATTOPIC_WORKER_NAME)}
main = "src/index.ts"
compatibility_date = "2025-12-10"
compatibility_flags = ["nodejs_compat"]

[vars]
ENVIRONMENT = "production"
R2_PUBLIC_URL = ${tomlValue(values.CATTOPIC_R2_PUBLIC_URL)}
USE_QUEUE = ${tomlValue(String(useQueue))}

[images]
binding = "IMAGES"

[[r2_buckets]]
binding = "R2_BUCKET"
bucket_name = ${tomlValue(values.CATTOPIC_R2_BUCKET_NAME)}

[[d1_databases]]
binding = "DB"
database_name = ${tomlValue(values.CATTOPIC_D1_DATABASE_NAME)}
database_id = ${tomlValue(values.CATTOPIC_D1_DATABASE_ID)}

[[kv_namespaces]]
binding = "CACHE_KV"
id = ${tomlValue(values.CATTOPIC_KV_NAMESPACE_ID)}
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

await writeFile(workerConfigPath, config);
console.log(`Generated ${workerConfigPath}`);
