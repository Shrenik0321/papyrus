"use client";

import { Button } from "@/components/ui/button";
import { OAUTH_ROUTES } from "@/lib/routes";

type GoogleSignInButtonProps = {
  /** App path after sign-in, e.g. `/dashboard` */
  callbackUrl: string;
  label?: string;
};

function toAbsoluteCallbackUrl(callbackUrl: string): string {
  if (callbackUrl.startsWith("http://") || callbackUrl.startsWith("https://")) {
    return callbackUrl;
  }
  const path = callbackUrl.startsWith("/") ? callbackUrl : `/${callbackUrl}`;
  return `${window.location.origin}${path}`;
}

export function GoogleSignInButton({
  callbackUrl,
  label = "Continue with Google",
}: GoogleSignInButtonProps) {
  const startGoogleSignIn = () => {
    const params = new URLSearchParams({
      callbackURL: toAbsoluteCallbackUrl(callbackUrl),
    });
    // Same origin as BETTER_AUTH_URL (e.g. :3000 via Next /api rewrite) so OAuth state + JWT cookies persist.
    window.location.assign(`/api${OAUTH_ROUTES.google}?${params.toString()}`);
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={startGoogleSignIn}
    >
      {label}
    </Button>
  );
}
