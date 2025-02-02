import { toast } from "@/hooks/use-toast";
import { LibraryBookData } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLibraryItem } from "./action";

export function useDeleteLibraryItemMutation() {
  const queryKey: QueryKey = ["assets", "library-asset", "list"];
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteLibraryItem,
    onSuccess: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<LibraryBookData[]>(
        queryKey,
        (oldData) => oldData && oldData.filter((d) => d.id !== id),
      );
      toast({ description: "Successfully deleted the item." });
    },
    onError(error) {
      console.error(error);
      toast({
        description: "Failed to delete library item.",
        variant: "destructive",
      });
    },
  });
  return mutation;
}
