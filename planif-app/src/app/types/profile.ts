import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export interface BankDetails {
  iban?: string;
  bic?: string;
  bank_name?: string;
}

export interface Profile {
  iduser: string;
  annule?: boolean;
  created_at?: Timestamp;
  email?: string;
  firstname?: string;
  lastname?: string;
  sex?: string;
  address?: string;
  city?: string;
  zipcode?: BigInteger;
  siret?: string;
  rib?: string;
  vat_applicable?: boolean;
  tax_status?: string;
  updated_at?: string;
  bank_details?: BankDetails;
  is_demo?: boolean;
  is_subscribed?: boolean;
  demo_started_at?: string | null;
  demo_expires_at?: string | null;
  subscription_started_at?: string | null;
  abo_plan? : string | null;
  logo_url? : string | null;
}
