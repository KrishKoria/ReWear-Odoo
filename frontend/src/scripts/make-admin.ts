import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

const ADMIN_EMAIL = "krishkoria2004@gmail.com";

async function makeUserAdmin() {
  try {
    const result = await db
      .update(user)
      .set({ role: "admin" })
      .where(eq(user.email, ADMIN_EMAIL))
      .returning();
    if (result.length > 0) {
      console.log(`Successfully made ${ADMIN_EMAIL} an admin`);
      console.log(result[0]);
    } else {
      console.log(`No user found with email ${ADMIN_EMAIL}`);
    }
  } catch (error) {
    console.error("Error making user admin:", error);
  }
}

makeUserAdmin().then(() => {
  console.log("Admin setup complete");
  process.exit(0);
});
