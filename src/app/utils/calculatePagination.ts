const calculatePagination = (options: { page: string; limit: string }) => {
  const newPagination = {
    page: Number(options?.page) || 0,
    limit: Number(options?.limit) || 5,
    skip: (Number(options?.page) - 1) * Number(options?.limit) || 0,
  };

  return newPagination;
};

export default calculatePagination;
