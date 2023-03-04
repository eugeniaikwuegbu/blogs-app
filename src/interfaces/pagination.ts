
export interface IPaginatedRes<T = any> {
    data: T[];
    pagination: {
      total: number;
      perPage: number;
      pageSize: number;
      pageNumber: number;
    };
  }