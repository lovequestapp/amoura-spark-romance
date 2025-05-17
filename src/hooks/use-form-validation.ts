
import { useState, useCallback } from 'react';

// Generic validation rule type
export type ValidationRule<T> = {
  validate: (value: T) => boolean;
  message: string;
};

// Type for the validation result
export type ValidationResult = {
  isValid: boolean;
  errors: Record<string, string>;
};

// The hook itself
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Partial<Record<keyof T, ValidationRule<any>[]>>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Update a single field
  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate field on change if it's been touched
    if (touched[field as string]) {
      validateField(field, value);
    }
  }, [touched, validationRules]);

  // Validate a single field
  const validateField = useCallback((field: keyof T, value: any) => {
    const fieldRules = validationRules[field] || [];
    
    // Find the first failing rule
    const failedRule = fieldRules.find(rule => !rule.validate(value));
    
    if (failedRule) {
      setErrors(prev => ({ ...prev, [field]: failedRule.message }));
      return false;
    } else {
      // Clear error if validation passes
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
      return true;
    }
  }, [validationRules]);

  // Mark a field as touched (typically on blur)
  const handleBlur = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, values[field]);
  }, [values, validateField]);

  // Validate all fields
  const validateForm = useCallback((): ValidationResult => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    // Check all fields with validation rules
    Object.entries(validationRules).forEach(([field, rules]) => {
      if (!rules) return;
      
      // Find the first failing rule
      const value = values[field as keyof T];
      const failedRule = rules.find(rule => !rule.validate(value));
      
      if (failedRule) {
        newErrors[field] = failedRule.message;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    
    // Mark all fields as touched on form validation
    const allTouched = Object.keys(validationRules).reduce(
      (acc, field) => ({ ...acc, [field]: true }), {}
    );
    setTouched(prev => ({ ...prev, ...allTouched }));
    
    return { isValid, errors: newErrors };
  }, [values, validationRules]);

  // Reset the form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues
  };
}

export default useFormValidation;
