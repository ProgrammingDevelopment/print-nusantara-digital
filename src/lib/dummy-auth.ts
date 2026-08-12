export type DummySession = {
  access_token: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  token_type: "bearer";
  user: {
    id: string;
    email: string;
    aud: string;
    confirmed_at: string | null;
    email_confirmed_at?: string | null;
    phone?: string | null;
    role: string;
    app_metadata: Record<string, unknown>;
    user_metadata: Record<string, unknown>;
    created_at: string;
    updated_at: string;
  };
};

const sanitizeId = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 32);

export const createDummySession = (email: string, fullName?: string): DummySession => {
  const now = Math.floor(Date.now() / 1000);
  const id = `dummy-${sanitizeId(email)}-${Math.floor(Math.random() * 10000)}`;
  const name = fullName || email.split("@")[0] || "Dummy User";

  return {
    access_token: `dummy-access-${id}`,
    expires_in: 3600,
    expires_at: now + 3600,
    refresh_token: `dummy-refresh-${id}`,
    token_type: "bearer",
    user: {
      id,
      email,
      aud: "authenticated",
      confirmed_at: new Date().toISOString(),
      role: "authenticated",
      app_metadata: { provider: "dummy" },
      user_metadata: { full_name: name },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  };
};
