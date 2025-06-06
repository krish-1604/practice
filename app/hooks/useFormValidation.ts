import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
}

interface FormErrors {
  name: string;
  email: string;
}

export function useFormValidation(initialData: FormData = { name: '', email: '' }) {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({ name: '', email: '' });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = { name: '', email: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const resetForm = () => {
    setFormData(initialData);
    setErrors({ name: '', email: '' });
  };

  const setInitialData = (data: FormData) => {
    setFormData(data);
    setErrors({ name: '', email: '' });
  };

  return {
    formData,
    errors,
    validateForm,
    handleInputChange,
    resetForm,
    setInitialData
  };
}