interface SignUpForm {
  username: string;
  password: string;
  email: string;
}

const validateForm = (formData: SignUpForm) => {
  const errors: { [key: string]: string } = {};

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    errors.email = 'Invalid email format';
  }

  // Username validation
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  if (!usernameRegex.test(formData.username)) {
    errors.username = 'Username can only contain letters and numbers';
  }

  // Password validation
  if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  // Check for spaces in any field
  for (const key in formData) {
    if (Object.hasOwnProperty.call(formData, key)) {
      if (formData[key as keyof SignUpForm].includes(' ')) {
        errors[key] = 'Field cannot contain spaces';
      }
    }
  }

  return errors;
};

export default validateForm;
