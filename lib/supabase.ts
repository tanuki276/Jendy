import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) return null;

  browserClient = createClient(url, publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  // Supabase intentionally returns a generic successful response for repeated
  // sign-ups so apps do not leak whether an email already exists. Jendy used to
  // interpret that response as "confirmation email sent", which was misleading
  // when the same Auth project already contained the account (for example from
  // another app sharing this Supabase project).
  const originalSignUp = browserClient.auth.signUp.bind(browserClient.auth);
  browserClient.auth.signUp = (async (credentials: any) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const request = siteUrl
      ? {
          ...credentials,
          options: {
            ...(credentials.options ?? {}),
            emailRedirectTo: siteUrl,
          },
        }
      : credentials;

    const result = await originalSignUp(request);

    if (!result.error && result.data.user && result.data.user.identities?.length === 0) {
      return {
        data: result.data,
        error: {
          name: "AuthApiError",
          message:
            "このメールアドレスは既に登録済みです。ログインしてください。 / Email ini sudah terdaftar. Silakan masuk.",
          status: 400,
          code: "user_already_exists",
        },
      } as any;
    }

    return result;
  }) as typeof browserClient.auth.signUp;

  return browserClient;
}
