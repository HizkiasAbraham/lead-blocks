export interface Company {
  id: number;
  name: string;
  description: string | null;
  created_at?: string;
}

export interface Lead {
  id: number;
  name: string;
  email: string;
  company_id: number | null;
  status: string;
  created_at: string;
  company: Company | null;
}

export interface LeadsResponse {
  data: Lead[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface CompaniesResponse {
  data: Company[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Lead status types
export type LeadStatus = 'active' | 'inactive' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'converted' | 'lost';

export const LEAD_STATUSES: LeadStatus[] = ['active', 'inactive', 'contacted', 'qualified', 'proposal', 'negotiation', 'converted', 'lost'];

export const STATUS_COLORS: Record<LeadStatus, string> = {
  active: 'bg-indigo-100 text-indigo-800',
  inactive: 'bg-gray-100 text-gray-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-blue-100 text-blue-800',
  proposal: 'bg-green-100 text-green-800',
  negotiation: 'bg-orange-100 text-orange-800',
  converted: 'bg-purple-100 text-purple-800',
  lost: 'bg-red-100 text-red-800',
};

