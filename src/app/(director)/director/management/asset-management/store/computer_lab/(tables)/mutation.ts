import { toast } from "@/hooks/use-toast";
import { ComputerLabItemData } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComputerLabItem } from "./action";

export function useDeleteComputerLabItemMutation() {
  const queryKey: QueryKey = ["assets", "computer-lab-asset", "list"];
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteComputerLabItem,
    onSuccess: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<ComputerLabItemData[]>(
        queryKey,
        (oldData) => oldData && oldData.filter((d) => d.id !== id),
      );
      toast({ description: "Successfully deleted the item." });
    },
    onError(error) {
      console.error(error);
      toast({
        description: "Failed to delete computer lab item.",
        variant: "destructive",
      });
    },
  });
  return mutation;
}
