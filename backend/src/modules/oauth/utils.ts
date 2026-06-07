export const OAUTH_PROVIDERS = {
  Google: 'google',
} as const;

export type OAuthProvider =
  (typeof OAUTH_PROVIDERS)[keyof typeof OAUTH_PROVIDERS];

export const OAUTH_API_MESSAGES = {
  googleNotConfigured: 'Google OAuth is not configured on the server',
  googleSignInFailed: 'Failed to start Google sign-in',
} as const;
