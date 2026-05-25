
export interface PrivacyPolicyConsent {
  accepted: boolean;
  accepted_at: string | null;
  version: string;
}

export interface RegisterData {
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth?: string;
  email: string;
  password: string;
  privacy_policy_consent?: PrivacyPolicyConsent;
}

export interface LoginData {
  email: string;
  password: string;
}
