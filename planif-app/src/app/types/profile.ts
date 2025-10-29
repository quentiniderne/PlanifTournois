import { Timestamp } from "next/dist/server/lib/cache-handlers/types";


export interface Profile {
  iduser: string;
  annule?: boolean;
  created_at?: Timestamp;
  email?: string;
  firstname: string;
  lastname: string;
  sex?: string;
  address?: string;
  city?: string;
  zipcode?: string;
  pays?: string;
  demo?: boolean;
  demofin?: boolean;
  ranking_fr?: string;
  utr?: string;
  ranking_wrld?: string;
  droit?: boolean;
  datmaj?: Timestamp;
}
