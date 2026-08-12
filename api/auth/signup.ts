import { z } from "zod";
import { getSupabaseAdmin } from "../_lib/supabase-admin";
import { handleOptions, readBody, rejectMethod, sendJson, setCorsHeaders } from "../_lib/http";
import type { ApiHandler } from "../_lib/types";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
});

const handler: ApiHandler = async (request, response) => {
  if (handleOptions(request, response)) return;
  setCorsHeaders(response);

  try {
    if (request.method !== "POST") {
      rejectMethod(response, ["POST", "OPTIONS"]);
      return;
    }

    const body = signUpSchema.parse(await readBody(request));
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
      user_metadata: {
        full_name: body.fullName,
      },
    });

    if (error) throw error;

    sendJson(response, 200, {
      data: {
        user: data.user,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create user";
    sendJson(response, 400, { error: message });
  }
};

export default handler;
