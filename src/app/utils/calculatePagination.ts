const calculatePagination = (options: {
  page: string;
  limit: string;
  sortBy: string;
  sortOrder: string;
}): {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
} => {
  let page = 1;
  let limit = 10;
  let skip = 0;
  let sortBy = "createdAt";
  let sortOrder = "desc";

  if (options?.page) {
    page = Number(options?.page);
  }
  if (options?.limit) {
    limit = Number(options?.limit);
  }

  skip = (page - 1) * limit;

  if (options?.sortBy) sortBy = options?.sortBy;
  if (options?.sortOrder) sortOrder = options?.sortOrder;

  return { page, limit, skip, sortBy, sortOrder };
};

export default calculatePagination;
