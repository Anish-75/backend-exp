import { auth } from "../../lib/auth.js";
import { db } from "../../db/client.js";
import { roles } from "../../db/schema/roles.schema.js";
import { eq } from "drizzle-orm";
import { generateTempPassword } from "../auth/password.utils.js";
 
export async function createInstAdmin(instId: string, phoneNumber: string) {
  const [instAdminRole] = await db.select().from(roles).where(eq(roles.name, "INSTADMIN"));
  const tempPassword = generateTempPassword();
 
  const result = await auth.api.signUpEmail({
    body: {
      email: `${phoneNumber}@placeholder.school-erp.local`,
      password: tempPassword,
      name: phoneNumber,
      phoneNumber: phoneNumber,
      inst_id: instId,
      role_id: instAdminRole.id,
      is_temp_password: true,
      is_active: true,
      is_archived: false,
    },
  });
 
  return { user: result.user, tempPassword };
}
