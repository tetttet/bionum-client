export interface User {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  date_of_birth?: string;
  privacy_policy_accepted_at?: string | null;
  privacy_policy_version?: string | null;
  created_at: string;
  updated_at: string;
}
