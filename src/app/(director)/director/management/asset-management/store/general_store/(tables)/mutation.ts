import { toast } from "@/hooks/use-toast";
import { GeneralStoreItemData } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGeneralStoreItem } from "./action";

export function useDeleteGeneralStoreItemMutation() {
  const queryKey: QueryKey = ["assets", "general-store-asset", "list"];
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteGeneralStoreItem,
    onSuccess: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<GeneralStoreItemData[]>(
        queryKey,
        (oldData) => oldData && oldData.filter((d) => d.id !== id),
      );
      toast({ description: "Successfully deleted the item." });
    },
    onError(error) {
      console.error(error);
      toast({
        description: "Failed to delete generalStore item.",
        variant: "destructive",
      });
    },
  });
  return mutation;
}
