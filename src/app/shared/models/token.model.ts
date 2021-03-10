export interface TokenJWT {
  token: string;
  refreshToken: string;
  valid: boolean;
  expirationDate: Date;
}
