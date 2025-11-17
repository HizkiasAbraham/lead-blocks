import { useState } from 'react';
import { Modal, Input, Alert, Button } from '../../components';
import { useApi } from '../../hooks';
import type { Company } from './types';

interface CreateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateCompanyModal({ isOpen, onClose, onSuccess }: CreateCompanyModalProps) {
  const [newCompany, setNewCompany] = useState({
    name: '',
    description: '',
  });

  // Create company API call
  const {
    loading: createLoading,
    error: createError,
    execute: createCompany,
  } = useApi<Company>('/api/companies', {
    method: 'POST',
    immediate: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!newCompany.name) {
      return;
    }

    try {
      await createCompany({
        name: newCompany.name,
        description: newCompany.description || null,
      });
      
      onSuccess();
      handleClose();
    } catch (err) {
      console.error('Failed to create company:', err);
    }
  };

  const handleClose = () => {
    setNewCompany({ name: '', description: '' });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="New Company"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
          label="Description"
          type="text"
          value={newCompany.description}
          onChange={(e) =>
            setNewCompany({ ...newCompany, description: e.target.value })
          }
          placeholder="Enter company description"
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
          >
            Add Company
          </Button>
        </div>
      </form>
    </Modal>
  );
}

