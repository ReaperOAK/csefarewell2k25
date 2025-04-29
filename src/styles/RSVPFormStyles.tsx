import styled from 'styled-components';

export const FormContainer = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--accent-color);
`;

export const FormTitle = styled.h3`
  font-family: 'Copperplate Gothic', serif;
  color: var(--accent-color);
  margin-bottom: 1.5rem;
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-family: 'Copperplate Gothic', serif;
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

export const RadioInput = styled.input`
  cursor: pointer;
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  background-color: rgba(30, 0, 0, 0.7);
  color: var(--text-color);
  border: 1px solid var(--accent-color);
  border-radius: 3px;
  font-family: 'Borel', sans-serif;
  resize: vertical;
  min-height: 100px;
`;

export const SubmitButton = styled.button`
  background-color: var(--secondary-color);
  color: var(--text-color);
  border: 1px solid var(--accent-color);
  padding: 12px 24px;
  margin: 10px 0;
  font-family: 'Copperplate Gothic', serif;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  font-size: 16px;
  
  &:hover:not(:disabled) {
    background-color: var(--accent-color);
    color: var(--primary-color);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SuccessMessage = styled.div`
  background-color: rgba(0, 100, 0, 0.3);
  color: #b8e0b8;
  padding: 1rem;
  border: 1px solid #4caf50;
  border-radius: 3px;
  margin-top: 1rem;
`;