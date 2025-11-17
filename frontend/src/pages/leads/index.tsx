import { useState, useMemo } from 'react';
import { Plus, Edit } from 'lucide-react';
import { Button, Card, Paginator, Table, Select, Alert, Loading } from '../../components';
import type { ColumnDef } from '../../components/Table';
import { useApi } from '../../hooks';
import { CreateLeadModal } from './CreateLeadModal';
import { UpdateLeadModal } from './UpdateLeadModal';
import type { Lead, LeadsResponse, CompaniesResponse, LeadStatus } from './types';
import { STATUS_COLORS, LEAD_STATUSES } from './types';

function Leads() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Memoize query object with status filter and pagination
  const leadsQuery = useMemo(
    () => {
      const query: Record<string, string | number> = {
        page: currentPage,
        pageSize: itemsPerPage,
      };
      if (statusFilter) {
        query.status = statusFilter;
      }
      return query;
    },
    [currentPage, itemsPerPage, statusFilter]
  );

  const companiesQuery = useMemo(
    () => ({ page: 1, pageSize: 100 }),
    []
  );

  // Fetch leads with pagination
  const {
    data: leadsData,
    loading: leadsLoading,
    error: leadsError,
    execute: refetchLeads,
  } = useApi<LeadsResponse>('/api/leads', {
    query: leadsQuery,
  });

  // Fetch all companies for the dropdown (we'll fetch a large page size to get all)
  const {
    data: companiesData,
  } = useApi<CompaniesResponse>('/api/companies', {
    query: companiesQuery,
  });

  const companies = companiesData?.data || [];
  const leads = leadsData?.data || [];
  const pagination = leadsData?.pagination;

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsUpdateModalOpen(true);
  };

  // Define columns using TanStack Table
  const columns = useMemo<ColumnDef<Lead>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'company',
        header: 'Company',
        cell: ({ row }) => {
          const company = row.original.company;
          return (
            <span className="text-gray-600">
              {company?.name || 'No Company'}
            </span>
          );
        },
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => (
          <span className="text-gray-600 truncate max-w-xs block">
            {row.original.email}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = (row.original.status || 'active') as LeadStatus;
          const colorClass = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
          const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);
          
          return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
              {displayStatus}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Button
            type="button"
            variant="secondary"
            className="p-2"
            onClick={() => handleEditLead(row.original)}
            title="Edit lead"
          >
            <Edit className="w-4 h-4" />
          </Button>
        ),
      },
    ],
    []
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Status filter options
  const statusOptions = useMemo(() => {
    return [
      { value: '', label: 'All Statuses' },
      ...LEAD_STATUSES.map((status) => ({ 
        value: status, 
        label: status.charAt(0).toUpperCase() + status.slice(1) 
      })),
    ];
  }, []);

  return (
    <div className="mt-4 space-y-4">
      <p className="text-xl font-bold text-white">
        Mini Dashboard met API-koppeling
      </p>
      <Card className="p-2">
        <div className="h-2 mb-4">
          {leadsLoading && <Loading />}
        </div>
        
        <div className="flex flex-col md:flex-row gap-2 justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-primary">Leads</h1>
          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-5 h-5" />
            New Lead
          </Button>
        </div>

        <div className="mb-6 w-full flex justify-center md:w-48 md:block">
          <Select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            options={statusOptions}
          />
        </div>

        {leadsError && (
          <Alert variant="error" className="mb-4">
            {leadsError}
          </Alert>
        )}

        <Table data={leads} columns={columns} />

        {pagination && pagination.totalPages > 0 && (
          <div className="mt-6 flex justify-end">
            <Paginator
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </Card>

      <CreateLeadModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={refetchLeads}
        companies={companies}
      />

      <UpdateLeadModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedLead(null);
        }}
        onSuccess={refetchLeads}
        lead={selectedLead}
        companies={companies}
      />
    </div>
  );
}

export default Leads;

