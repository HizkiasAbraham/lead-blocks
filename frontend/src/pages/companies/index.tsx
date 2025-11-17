import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button, Card, Paginator, Table, Alert, Loading } from '../../components';
import type { ColumnDef } from '../../components/Table';
import { useApi } from '../../hooks';
import { CreateCompanyModal } from './CreateCompanyModal';
import type { Company, CompaniesResponse } from './types';

function Companies() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Memoize query object to prevent infinite re-renders
  const companiesQuery = useMemo(
    () => ({ page: currentPage, pageSize: itemsPerPage }),
    [currentPage, itemsPerPage]
  );

  // Fetch companies with pagination
  const {
    data: companiesData,
    loading: companiesLoading,
    error: companiesError,
    execute: refetchCompanies,
  } = useApi<CompaniesResponse>('/api/companies', {
    query: companiesQuery,
  });

  const companies = companiesData?.data || [];
  const pagination = companiesData?.pagination;

  // Define columns using TanStack Table
  const columns = useMemo<ColumnDef<Company>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => (
          <span className="text-gray-600 truncate max-w-xs block">
            {row.original.description || 'N/A'}
          </span>
        ),
      },
    ],
    []
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="mt-4 space-y-4">
      <p className="text-xl font-bold text-white">
        Mini Dashboard met API-koppeling
      </p>
      <Card className="p-2">
        <div className="h-2 mb-4">
          {companiesLoading && <Loading />}
        </div>
        
        <div className="flex flex-col md:flex-row gap-2 justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-primary">Companies</h1>
          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-5 h-5" />
            New Company
          </Button>
        </div>

        {companiesError && (
          <Alert variant="error" className="mb-4">
            {companiesError}
          </Alert>
        )}

        <Table data={companies} columns={columns} />

        {pagination && (
          <div className="mt-6 flex justify-end">
            <Paginator
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </Card>

      <CreateCompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refetchCompanies}
      />
    </div>
  );
}

export default Companies;

