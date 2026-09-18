import { LoginCredentials } from '../pages/LoginPage';
import { requiredEnvironmentVariable } from '../utils/environment';

export type UserRole = 'admin' | 'employee' | 'financialApprover1' | 'financialApprover2';

const roleVariables: Record<UserRole, { username: string; password: string }> = {
  admin: { username: 'ADMIN_USERNAME', password: 'ADMIN_PASSWORD' },
  employee: { username: 'EMPLOYEE_USERNAME', password: 'EMPLOYEE_PASSWORD' },
  financialApprover1: {
    username: 'FINANCIAL_APPROVER_1_USERNAME',
    password: 'FINANCIAL_APPROVER_1_PASSWORD',
  },
  financialApprover2: {
    username: 'FINANCIAL_APPROVER_2_USERNAME',
    password: 'FINANCIAL_APPROVER_2_PASSWORD',
  },
};

export function credentialsFor(role: UserRole): LoginCredentials {
  const variables = roleVariables[role];
  return {
    companyCode: requiredEnvironmentVariable('COMPANY_CODE'),
    username: requiredEnvironmentVariable(variables.username),
    password: requiredEnvironmentVariable(variables.password),
  };
}
