import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@shared/config/constants";
import { cuisineService } from "../services/cuisineService";
import type { CreateCuisineInput, UpdateCuisineInput } from "../types/cuisine";

export function useCuisines() {
  return useQuery({
    queryKey: QUERY_KEYS.cuisines,
    queryFn: () => cuisineService.getAll(),
  });
}

export function useCuisine(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.cuisine(id),
    queryFn: () => cuisineService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCuisine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCuisineInput) => cuisineService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cuisines });
    },
  });
}

export function useUpdateCuisine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCuisineInput }) =>
      cuisineService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cuisines });
    },
  });
}

export function useDeleteCuisine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cuisineService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cuisines });
    },
  });
}
