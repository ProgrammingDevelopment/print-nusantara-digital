import { z } from "zod";
import { getSupabaseServer } from "../_lib/supabase-admin";
import { handleOptions, readBody, rejectMethod, sendJson, setCorsHeaders } from "../_lib/http";
import type { ApiHandler } from "../_lib/types";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const handler: ApiHandler = async (request, response) => {
  if (handleOptions(request, response)) return;
  setCorsHeaders(response);

  try {
    if (request.method !== "POST") {
      rejectMethod(response, ["POST", "OPTIONS"]);
      return;
    }

    const body = signInSchema.parse(await readBody(request));
    const supabase = getSupabaseServer();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (error) throw error;

    sendJson(response, 200, {
      data: {
        session: data.session,
        user: data.user,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to sign in";
    sendJson(response, 400, { error: message });
  }
};

export default handler;
