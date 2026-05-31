export interface PaginationInput {
  page: number;
  pageSize: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export const getPagination = ({ page, pageSize }: PaginationInput) => ({
  skip: (page - 1) * pageSize,
  take: pageSize,
});

export const getPaginationMeta = (
  { page, pageSize }: PaginationInput,
  total: number,
): PaginationMeta => ({
  page,
  pageSize,
  total,
  totalPages: Math.max(1, Math.ceil(total / pageSize)),
});
