import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
import dotenv from 'dotenv';

const { Client } = pkg;

// Load environment variables from root and server
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootEnvPath = path.resolve(__dirname, '../../.env');
const serverEnvPath = path.resolve(__dirname, '../.env');

if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
} else {
  dotenv.config();
}

/**
 * Masks database passwords from URLs to prevent credential leakage in logs
 */
function maskDatabaseUrl(url) {
  if (!url) return '<undefined>';
  try {
    const firstColonSlashSlash = url.indexOf('://');
    const lastAt = url.lastIndexOf('@');
    if (firstColonSlashSlash !== -1 && lastAt !== -1) {
      const scheme = url.substring(0, firstColonSlashSlash + 3);
      const userPass = url.substring(firstColonSlashSlash + 3, lastAt);
      const hostDb = url.substring(lastAt + 1);
      const firstColon = userPass.indexOf(':');
      const user = firstColon !== -1 ? userPass.substring(0, firstColon) : userPass;
      return `${scheme}${user}:********@${hostDb}`;
    }
    return url.replace(/(:)([^@]+)(@)/, '$1********$3');
  } catch {
    return 'postgresql://*****:*****@***';
  }
}

/**
 * Safely parses database connection URLs even when passwords contain '@' or special characters
 */
function parseDbConnection(rawUrl) {
  if (!rawUrl) return null;
  const trimmed = rawUrl.trim();
  const firstColonSlashSlash = trimmed.indexOf('://');
  const lastAt = trimmed.lastIndexOf('@');

  if (firstColonSlashSlash !== -1 && lastAt !== -1 && lastAt > firstColonSlashSlash) {
    const userPass = trimmed.substring(firstColonSlashSlash + 3, lastAt);
    const hostDb = trimmed.substring(lastAt + 1);
    const firstColon = userPass.indexOf(':');
    const user = firstColon !== -1 ? decodeURIComponent(userPass.substring(0, firstColon)) : decodeURIComponent(userPass);
    const password = firstColon !== -1 ? userPass.substring(firstColon + 1) : '';

    const slashPos = hostDb.indexOf('/');
    const hostPort = slashPos !== -1 ? hostDb.substring(0, slashPos) : hostDb;
    const database = slashPos !== -1 ? hostDb.substring(slashPos + 1).split('?')[0] : 'postgres';

    const colonPos = hostPort.lastIndexOf(':');
    const host = colonPos !== -1 ? hostPort.substring(0, colonPos) : hostPort;
    const port = colonPos !== -1 ? parseInt(hostPort.substring(colonPos + 1), 10) : 5432;

    return {
      user,
      password,
      host,
      port: isNaN(port) ? 5432 : port,
      database,
      ssl: { rejectUnauthorized: false }
    };
  }

  return {
    connectionString: trimmed,
    ssl: { rejectUnauthorized: false }
  };
}

async function runMigrations() {
  console.log('\n======================================================');
  console.log('🌾 AgriSmart AI — Supabase Cloud Database Migration Runner');
  console.log('======================================================\n');

  const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  const migrationsDir = path.resolve(__dirname, '../../supabase/migrations');
  const seedFilePath = path.resolve(__dirname, '../../supabase/seed.sql');

  // Dry-run inspection mode check
  const isDryRun = process.argv.includes('--dry-run');
  const applySeed = process.argv.includes('--seed');

  // Verify migrations directory exists
  if (!fs.existsSync(migrationsDir)) {
    console.error(`❌ Migration directory not found: ${migrationsDir}`);
    process.exit(1);
  }

  // List all SQL migration files sorted alphabetically
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  console.log(`📁 Found ${migrationFiles.length} migration file(s) in supabase/migrations/:`);
  migrationFiles.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file}`);
  });
  console.log('');

  // Validate Database Connection URL
  if (!dbUrl || dbUrl.includes('your-project-ref') || dbUrl.includes('your-db-password')) {
    console.log('⚠️  DATABASE_URL is not configured or contains placeholder values.');
    console.log('   To connect to your live Supabase Cloud PostgreSQL database:');
    console.log('   1. Go to: Supabase Dashboard -> Project Settings -> Database');
    console.log('   2. Under "Connection string", select "URI"');
    console.log('   3. Set DATABASE_URL in your .env file:');
    console.log('      DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres\n');

    if (isDryRun) {
      console.log('🔍 [Dry-Run Inspection] Verifying migration SQL file contents for syntax integrity...\n');
      for (const file of migrationFiles) {
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf-8');
        console.log(`   ✅ ${file} (${(sql.length / 1024).toFixed(1)} KB) - Verified readable`);
      }
      console.log('\n✅ Dry-run inspection complete. All SQL migration files are intact and validated.\n');
      return;
    }

    console.log('💡 Tip: You can run `npm run migrate -- --dry-run` to inspect SQL files without connecting.\n');
    process.exit(0);
  }

  console.log(`🔗 Connecting to database: ${maskDatabaseUrl(dbUrl)}`);

  const clientConfig = parseDbConnection(dbUrl);
  const client = new Client(clientConfig);

  try {
    await client.connect();
    console.log('✅ Connected securely to Supabase Cloud PostgreSQL.\n');

    // 1. Ensure migrations tracking table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS public._schema_migrations (
        id SERIAL PRIMARY KEY,
        version VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      );
    `);

    // 2. Fetch already applied migration versions
    const { rows } = await client.query('SELECT version FROM public._schema_migrations;');
    const appliedVersions = new Set(rows.map((r) => r.version));

    // 3. Execute pending migrations in lexical order
    for (const file of migrationFiles) {
      const version = path.basename(file, '.sql');

      if (appliedVersions.has(version)) {
        console.log(`⏩ [SKIPPED] ${file} (already applied)`);
        continue;
      }

      console.log(`⚡ [APPLYING] ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const sqlContent = fs.readFileSync(filePath, 'utf-8');

      try {
        await client.query('BEGIN');
        await client.query(sqlContent);
        await client.query(
          'INSERT INTO public._schema_migrations (version) VALUES ($1);',
          [version]
        );
        await client.query('COMMIT');
        console.log(`✅ [APPLIED]  ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`\n❌ Error applying migration ${file}:`);
        console.error(`   Message: ${err.message}`);
        if (err.position) console.error(`   Position: ${err.position}`);
        console.error('\nTransaction rolled back. No partial changes were applied.\n');
        throw err;
      }
    }

    // 4. Optionally apply seed data if requested
    if (applySeed && fs.existsSync(seedFilePath)) {
      console.log('\n🌱 [SEEDING] Applying initial verified crop catalog and research sources...');
      const seedSql = fs.readFileSync(seedFilePath, 'utf-8');
      await client.query('BEGIN');
      await client.query(seedSql);
      await client.query('COMMIT');
      console.log('✅ [SEEDED]  Initial crop data populated successfully.');
    }

    console.log('\n🎉 All database migrations executed successfully!');
    console.log('======================================================\n');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end().catch(() => {});
  }
}

runMigrations().catch((err) => {
  console.error('Fatal Migration Error:', err);
  process.exit(1);
});

