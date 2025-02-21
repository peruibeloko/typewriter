export interface RequestLogin {
  email: string;
  token: string;
}

export interface RequestSignup {
  email: string;
  displayName: string;
}

export type EntryAllowlist = {
  id: string;
  email: string;
  isActive: boolean;
};
