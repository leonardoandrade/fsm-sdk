export type ClientConfig = {
  debug: boolean | undefined;
  tokenCacheFilePath: string | undefined;

  oauthEndpoint: string;

  clientIdentifier: string;
  clientSecret: string;
  clientVersion: string;

  authAccountName: string;
  authUserName: string;
  authPassword: string;
}
