import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Chemins accessibles même si le parcours d'inscription n'est pas terminé.
const ONBOARDING_EXEMPT_PREFIXES = [
  "/onboarding",
  "/login",
  "/auth",
  "/api",
  "/mentions-legales",
  "/confidentialite",
  "/cgu",
];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Rafraîchit la session si besoin — nécessaire pour que les Server Components
  // lisent un état d'authentification à jour.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const exempt = ONBOARDING_EXEMPT_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (user && !exempt) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_complete")
      .eq("id", user.id)
      .single();

    if (profile?.onboarding_complete === false) {
      const redirectResponse = NextResponse.redirect(new URL("/onboarding", request.url));
      response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
      return redirectResponse;
    }
  }

  return response;
}
