export interface Company {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
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

