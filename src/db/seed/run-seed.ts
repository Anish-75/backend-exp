import 'dotenv/config';
import { seedRolesAndPermissions } from './seed-roles-permissions';
import { seedSystemInst } from './seed-system-inst';
import { seedSuperAdmin } from './seed-superadmin';
import { pool } from '../client';

async function main() {
  await seedRolesAndPermissions();
  const systemInst = await seedSystemInst();
  await seedSuperAdmin(systemInst.id);
}

main()
  .then(async () => {
    console.log('🌱 Seeding complete');
    await pool.end();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('❌ Seed failed:', err);
    await pool.end();
    process.exit(1);
  });