export interface CuisineType {
  id: string;
  name: string;
  created_at: string;
}

export type CreateCuisineInput = Pick<CuisineType, "name">;

export type UpdateCuisineInput = Partial<CreateCuisineInput>;
