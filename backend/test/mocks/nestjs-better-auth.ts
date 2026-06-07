export const AllowAnonymous = () => () => undefined;
export const OptionalAuth = () => () => undefined;
export const Session = () => () => undefined;
export const AuthModule = { forRoot: () => ({ module: class AuthModuleMock {} }) };
export class AuthService {
  api = {};
}
