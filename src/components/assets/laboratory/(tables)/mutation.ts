import { toast } from "@/hooks/use-toast";
import { LaboratoryItemData } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLaboratoryItem } from "./action";

export function useDeleteLaboratoryItemMutation() {
  const queryKey: QueryKey = ["assets", "laboratory-asset", "list"];
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteLaboratoryItem,
    onSuccess: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<LaboratoryItemData[]>(
        queryKey,
        (oldData) => oldData && oldData.filter((d) => d.id !== id),
      );
      toast({ description: "Successfully deleted the item." });
    },
    onError(error) {
      console.error(error);
      toast({
        description: "Failed to delete laboratory item.",
        variant: "destructive",
      });
    },
  });
  return mutation;
}
