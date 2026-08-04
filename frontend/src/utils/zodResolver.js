// Custom Zod resolver helper for React Hook Form
export const zodResolver = (schema) => async (values) => {
  const result = schema.safeParse(values);
  if (result.success) {
    return { values: result.data, errors: {} };
  }
  
  const errors = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = {
        type: issue.code,
        message: issue.message,
      };
    }
  });

  return { values: {}, errors };
};
