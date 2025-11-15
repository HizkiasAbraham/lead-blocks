import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button, Card, Modal, Input, Paginator, Table, Select } from '../components';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  status: 'Active' | 'Inactive';
}

function Home() {
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    company: '',
    email: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  const leads: Lead[] = [
    {
      id: '1',
      name: 'Sarah Brown',
      company: 'ABC Corp',
      email: 'sarah.brown@example.com',
      status: 'Active',
    },
    {
      id: '2',
      name: 'John Smith',
      company: 'XYZ Ltd',
      email: 'john.smith@example.com',
      status: 'Active',
    },
    {
      id: '3',
      name: 'Anna Johnson',
      company: 'Acme Inc',
      email: 'anna.johnson@example.com',
      status: 'Inactive',
    },
    {
      id: '4',
      name: 'Mark Wilson',
      company: 'Globex',
      email: 'mark.wilson@example.com',
      status: 'Active',
    },
  ];

  const filteredLeads = statusFilter
    ? leads.filter((lead) => lead.status === statusFilter)
    : leads;

  // Calculate pagination
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const statusOptions = [
    { value: '', label: 'Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];

  const handleAddLead = () => {
    // TODO: Add API call to create lead
    console.log('New lead:', newLead);
    setIsModalOpen(false);
    setNewLead({ name: '', company: '', email: '', status: 'Active' });
  };

  return (
    <div className="mt-4 space-y-4">
      <p className="text-xl font-bold text-white">
        Mini Dashboard met API-koppeling
      </p>
      <Card className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-primary">Leads</h1>
          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-5 h-5" />
            New Lead
          </Button>
        </div>

        <div className="mb-6 w-48">
          <Select
            value={statusFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            options={statusOptions}
            className="w-64"
          />
        </div>

        <Table
          columns={[
            {
              key: 'name',
              header: 'Name',
            },
            {
              key: 'company',
              header: 'Company',
            },
            {
              key: 'email',
              header: 'Email',
              render: (lead) => (
                <span className="text-gray-600 truncate max-w-xs block">
                  {lead.email}
                </span>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              render: (lead) => (
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    lead.status === 'Active'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {lead.status}
                </span>
              ),
            },
          ]}
          data={paginatedLeads}
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
          setNewLead({ name: '', company: '', email: '', status: 'Active' });
        }}
        title="New Lead"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Name"
            type="text"
            value={newLead.name}
            onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
            placeholder="Enter name"
            required
          />
          <Input
            label="Company"
            type="text"
            value={newLead.company}
            onChange={(e) =>
              setNewLead({ ...newLead, company: e.target.value })
            }
            placeholder="Enter company"
            required
          />
          <Input
            label="Email"
            type="email"
            value={newLead.email}
            onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
            placeholder="Enter email"
            required
          />
          <Select
            label="Status"
            value={newLead.status}
            onChange={(e) =>
              setNewLead({
                ...newLead,
                status: e.target.value as 'Active' | 'Inactive',
              })
            }
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
            ]}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setNewLead({ name: '', company: '', email: '', status: 'Active' });
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddLead}>
              Add Lead
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Home;
