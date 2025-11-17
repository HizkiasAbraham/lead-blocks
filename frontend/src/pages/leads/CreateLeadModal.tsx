import { useState } from 'react';
import { Modal, Input, Select, Alert, Button } from '../../components';
import { useApi } from '../../hooks';
import type { Lead, Company } from './types';
import { LEAD_STATUSES } from './types';

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  companies: Company[];
}

export function CreateLeadModal({ isOpen, onClose, onSuccess, companies }: CreateLeadModalProps) {
  const [newLead, setNewLead] = useState({
    name: '',
    companyId: '',
    email: '',
    status: '',
  });

  // Create lead API call
  const {
    loading: createLoading,
    error: createError,
    execute: createLead,
  } = useApi<Lead>('/api/leads', {
    method: 'POST',
    immediate: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newLead.name?.trim()) {
      return;
    }
    
    if (!newLead.email?.trim()) {
      return;
    }
    
    if (!newLead.companyId) {
      return;
    }
    
    if (!newLead.status) {
      return;
    }

    try {
      await createLead({
        name: newLead.name.trim(),
        email: newLead.email.trim(),
        companyId: Number(newLead.companyId),
        status: newLead.status,
      });
      
      onSuccess();
      handleClose();
    } catch (err) {
      console.error('Failed to create lead:', err);
    }
  };

  const handleClose = () => {
    setNewLead({ name: '', companyId: '', email: '', status: '' });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="New Lead"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name *"
          type="text"
          value={newLead.name}
          onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
          placeholder="Enter name"
          required
        />
        <Input
          label="Email *"
          type="email"
          value={newLead.email}
          onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
          placeholder="Enter email"
          required
        />
        <Select
          label="Company *"
          value={newLead.companyId}
          onChange={(e) =>
            setNewLead({ ...newLead, companyId: e.target.value })
          }
          options={[
            { value: '', label: 'Select a company' },
            ...companies.map((company) => ({
              value: String(company.id),
              label: company.name,
            })),
          ]}
        />
        <Select
          label="Status *"
          value={newLead.status}
          onChange={(e) =>
            setNewLead({ ...newLead, status: e.target.value })
          }
          options={[
            { value: '', label: 'Select a status' },
            ...LEAD_STATUSES.map((status) => ({
              value: status,
              label: status.charAt(0).toUpperCase() + status.slice(1),
            })),
          ]}
        />
        {createError && (
          <Alert variant="error">{createError}</Alert>
        )}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={createLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={createLoading}
            disabled={!newLead.name || !newLead.email || !newLead.companyId || !newLead.status}
          >
            Add Lead
          </Button>
        </div>
      </form>
    </Modal>
  );
}

