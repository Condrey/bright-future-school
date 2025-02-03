import { toast } from "@/hooks/use-toast";
import { FoodStoreItemData } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFoodStoreItem } from "./action";

export function useDeleteFoodStoreItemMutation() {
  const queryKey: QueryKey = ["assets", "food-store-asset", "list"];
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteFoodStoreItem,
    onSuccess: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<FoodStoreItemData[]>(
        queryKey,
        (oldData) => oldData && oldData.filter((d) => d.id !== id),
      );
      toast({ description: "Successfully deleted the item." });
    },
    onError(error) {
      console.error(error);
      toast({
        description: "Failed to delete foodStore item.",
        variant: "destructive",
      });
    },
  });
  return mutation;
}
