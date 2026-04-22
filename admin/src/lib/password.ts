/**
 * Password utility for KAIZEN Admin
 */

export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /[0-9]/,
  hasSpecial: /[!@#$%^&*(),.?":{}|<>]/,
};

/**
 * Validates a password against KAIZEN standards
 */
export const validatePassword = (password: string) => {
  return {
    length: password.length >= PASSWORD_REQUIREMENTS.minLength,
    uppercase: PASSWORD_REQUIREMENTS.hasUppercase.test(password),
    lowercase: PASSWORD_REQUIREMENTS.hasLowercase.test(password),
    number: PASSWORD_REQUIREMENTS.hasNumber.test(password),
    special: PASSWORD_REQUIREMENTS.hasSpecial.test(password),
  };
};

/**
 * Generates a strong, random password
 */
export const generatePassword = (length = 12) => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
  
  const allChars = uppercase + lowercase + numbers + special;
  let password = "";
  
  // Ensure at least one of each required type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Fill the rest
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => 0.5 - Math.random()).join('');
};
