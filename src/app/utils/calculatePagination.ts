const calculatePagination = (options: {
  page: string;
  limit: string;
}): { page: number; limit: number; skip: number } => {
  let page = 1;
  let limit = 10;
  let skip = 0;

  if (options?.page) {
    page = Number(options?.page);
  }
  if (options?.limit) {
    limit = Number(options?.limit);
  }

  skip = (page - 1) * limit;

  return { page, limit, skip };
};

export default calculatePagination;
