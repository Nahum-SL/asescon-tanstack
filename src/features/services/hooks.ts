import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "./api";
import type { Service } from "./types";

export const SERVICES_QUERY_KEY = ["services"];
export const useServices = () =>
  useQuery<Service[]>({
    queryKey: SERVICES_QUERY_KEY,
    queryFn: getServices,
  });

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createService,

    onMutate: async (newService) => {
      await queryClient.cancelQueries({ queryKey: SERVICES_QUERY_KEY });

      const previous = queryClient.getQueryData<Service[]>(SERVICES_QUERY_KEY);

      const optimisticService: Service = {
        ...newService,
        id: Date.now(), // Temporal
      } as Service;

      queryClient.setQueryData<Service[]>(SERVICES_QUERY_KEY, (old) => [
        ...(old || []),
        optimisticService,
      ]);

      return { previous };
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: SERVICES_QUERY_KEY,
      });
    },

    onError: (_err, _new, context) => {
      queryClient.setQueryData(["services"], context?.previous);
    },
  });
};
