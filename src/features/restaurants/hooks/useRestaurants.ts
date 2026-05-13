import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@shared/config/constants";
import { useAuth } from "@features/auth/hooks/useAuth";
import { restaurantService } from "../services/restaurantService";
import { t } from "@shared/config/translations";
import type { CreateRestaurantInput, UpdateRestaurantInput } from "../types/restaurant";

export function useRestaurants() {
  return useQuery({
    queryKey: QUERY_KEYS.restaurants,
    queryFn: () => restaurantService.getAll(),
  });
}

export function useRestaurant(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.restaurant(id),
    queryFn: () => restaurantService.getById(id),
    enabled: !!id,
  });
}

export function useCreateRestaurant() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (input: CreateRestaurantInput) => {
      if (!user) throw new Error(t.errors.userNotAuthenticated);
      return restaurantService.create(user.id, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.restaurants });
    },
  });
}

export function useUpdateRestaurant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateRestaurantInput }) =>
      restaurantService.update(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.restaurants });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.restaurant(variables.id),
      });
    },
  });
}

export function useDeleteRestaurant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => restaurantService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.restaurants });
    },
  });
}
