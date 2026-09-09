export interface PasswordChecks {
  length: boolean;
  hasLower: boolean;
  hasUpper: boolean;
  hasDigit: boolean;
  hasSpecial: boolean;
}

export type PasswordCheckRule = keyof PasswordChecks;

export interface PasswordStrengthResult {
  isValid: boolean;
  errors: PasswordCheckRule[];
}

function checkPasswordStrength(password: string): PasswordStrengthResult {
  const checks: PasswordChecks = {
    length: password.length >= 8,
    hasLower: /[a-z]/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasDigit: /\d/.test(password),
    hasSpecial: /[@$!%*?&]/.test(password),
  };

  const isValid = Object.values(checks).every(Boolean);

  // Cast keys to keyof PasswordChecks to preserve strict return typing
  const errors = (Object.keys(checks) as PasswordCheckRule[]).filter(
    (key) => !checks[key],
  );

  return {
    isValid,
    errors,
  };
}

export default checkPasswordStrength;
