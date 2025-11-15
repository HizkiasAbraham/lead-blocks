import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button, Card, Modal, Input, Paginator, Table } from '../components';

interface Company {
  id: string;
  name: string;
  industry: string;
  email: string;
  employees: string;
}

function Company() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: '',
    email: '',
    employees: '',
  });

  const companies: Company[] = [
    {
      id: '1',
      name: 'ABC Corp',
      industry: 'Technology',
      email: 'contact@abccorp.com',
      employees: '50-100',
    },
    {
      id: '2',
      name: 'XYZ Ltd',
      industry: 'Finance',
      email: 'info@xyzltd.com',
      employees: '100-500',
    },
    {
      id: '3',
      name: 'Acme Inc',
      industry: 'Manufacturing',
      email: 'hello@acmeinc.com',
      employees: '500-1000',
    },
    {
      id: '4',
      name: 'Globex',
      industry: 'Retail',
      email: 'support@globex.com',
      employees: '1000+',
    },
  ];

  // Calculate pagination
  const totalPages = Math.ceil(companies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCompanies = companies.slice(startIndex, endIndex);

  const handleAddCompany = () => {
    // TODO: Add API call to create company
    console.log('New company:', newCompany);
    setIsModalOpen(false);
    setNewCompany({ name: '', industry: '', email: '', employees: '' });
  };

  return (
    <div className="mt-4 space-y-4">
      <p className="text-xl font-bold text-white">
        Mini Dashboard met API-koppeling
      </p>
      <Card className="p-8">
        <div className="flex justify-between items-center mb-6">
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

        <Table
          columns={[
            {
              key: 'name',
              header: 'Name',
            },
            {
              key: 'industry',
              header: 'Industry',
            },
            {
              key: 'email',
              header: 'Email',
              render: (company) => (
                <span className="text-gray-600 truncate max-w-xs block">
                  {company.email}
                </span>
              ),
            },
            {
              key: 'employees',
              header: 'Employees',
            },
          ]}
          data={paginatedCompanies}
        />

        <div className="mt-6 flex justify-end">
          <Paginator
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setNewCompany({ name: '', industry: '', email: '', employees: '' });
        }}
        title="New Company"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Company Name"
            type="text"
            value={newCompany.name}
            onChange={(e) =>
              setNewCompany({ ...newCompany, name: e.target.value })
            }
            placeholder="Enter company name"
            required
          />
          <Input
            label="Industry"
            type="text"
            value={newCompany.industry}
            onChange={(e) =>
              setNewCompany({ ...newCompany, industry: e.target.value })
            }
            placeholder="Enter industry"
            required
          />
          <Input
            label="Email"
            type="email"
            value={newCompany.email}
            onChange={(e) =>
              setNewCompany({ ...newCompany, email: e.target.value })
            }
            placeholder="Enter email"
            required
          />
          <Input
            label="Employees"
            type="text"
            value={newCompany.employees}
            onChange={(e) =>
              setNewCompany({ ...newCompany, employees: e.target.value })
            }
            placeholder="e.g., 50-100, 100-500, 1000+"
            required
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setNewCompany({
                  name: '',
                  industry: '',
                  email: '',
                  employees: '',
                });
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddCompany}>
              Add Company
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Company;

