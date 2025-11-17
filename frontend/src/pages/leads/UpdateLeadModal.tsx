import { useState, useEffect, useMemo } from 'react';
import { Modal, Input, Select, Alert, Button } from '../../components';
import { useApi } from '../../hooks';
import type { Lead, Company } from './types';
import { LEAD_STATUSES } from './types';

interface UpdateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lead: Lead | null;
  companies: Company[];
}

export function UpdateLeadModal({ isOpen, onClose, onSuccess, lead, companies }: UpdateLeadModalProps) {
  const [updatedLead, setUpdatedLead] = useState({
    name: '',
    companyId: '',
    email: '',
    status: '',
  });

  // Dynamic API path based on lead ID
  const apiPath = useMemo(() => {
    return lead ? `/api/leads/${lead.id}` : '';
  }, [lead]);

  // Update lead API call
  const {
    loading: updateLoading,
    error: updateError,
    execute: updateLead,
  } = useApi<Lead>(apiPath, {
    method: 'PUT',
    immediate: false,
  });

  // Populate form when lead changes
  useEffect(() => {
    if (lead) {
      setUpdatedLead({
        name: lead.name || '',
        email: lead.email || '',
        companyId: lead.company_id ? String(lead.company_id) : '',
        status: lead.status || 'active',
      });
    }
  }, [lead]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate required fields
    if (!updatedLead.name?.trim()) {
      return;
    }
    
    if (!updatedLead.email?.trim()) {
      return;
    }
    
    if (!updatedLead.companyId) {
      return;
    }
    
    if (!updatedLead.status) {
      return;
    }

    if (!lead) {
      return;
    }

    try {
      await updateLead({
        name: updatedLead.name.trim(),
        email: updatedLead.email.trim(),
        companyId: Number(updatedLead.companyId),
        status: updatedLead.status,
      });
      
      onSuccess();
      handleClose();
    } catch (err) {
      console.error('Failed to update lead:', err);
    }
  };

  const handleClose = () => {
    setUpdatedLead({ name: '', companyId: '', email: '', status: '' });
    onClose();
  };

  if (!lead) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Update Lead"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name *"
          type="text"
          value={updatedLead.name}
          onChange={(e) => setUpdatedLead({ ...updatedLead, name: e.target.value })}
          placeholder="Enter name"
          required
        />
        <Input
          label="Email *"
          type="email"
          value={updatedLead.email}
          onChange={(e) => setUpdatedLead({ ...updatedLead, email: e.target.value })}
          placeholder="Enter email"
          required
        />
        <Select
          label="Company *"
          value={updatedLead.companyId}
          onChange={(e) =>
            setUpdatedLead({ ...updatedLead, companyId: e.target.value })
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
          value={updatedLead.status}
          onChange={(e) =>
            setUpdatedLead({ ...updatedLead, status: e.target.value })
          }
          options={[
            { value: '', label: 'Select a status' },
            ...LEAD_STATUSES.map((status) => ({
              value: status,
              label: status.charAt(0).toUpperCase() + status.slice(1),
            })),
          ]}
        />
        {updateError && (
          <Alert variant="error">{updateError}</Alert>
        )}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={updateLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={updateLoading}
            disabled={!updatedLead.name || !updatedLead.email || !updatedLead.companyId || !updatedLead.status}
          >
            Update Lead
          </Button>
        </div>
      </form>
    </Modal>
  );
}

