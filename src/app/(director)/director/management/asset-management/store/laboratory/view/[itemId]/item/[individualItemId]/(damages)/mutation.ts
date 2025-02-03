"use client";

import { toast } from "@/hooks/use-toast";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addDamage,
  deleteDamage,
  repairUnrepairDamage,
  updateDamage,
} from "./action";

const queryKey: QueryKey = ["assets", "laboratory-asset", "item"];

export function useAddItemDamage() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addDamage,
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey });
      toast({ description: "successfully registered the damage." });
    },
    onError(error) {
      console.error(error);
      toast({
        description: "failed to record this damage.",
        variant: "destructive",
      });
    },
  });
  return mutation;
}

export function useUpdateItemDamage() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateDamage,
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey });
      toast({ description: "successfully updated the damage." });
    },
    onError(error) {
      console.error(error);
      toast({
        description: "failed to update this damage.",
        variant: "destructive",
      });
    },
  });
  return mutation;
}

export function useRepairUnrepairItemDamage() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: repairUnrepairDamage,
    onSuccess: async (_, variables) => {
      await queryClient.cancelQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey });
      toast({
        description: `successfully ${variables.isRepaired ? "repaired" : "undone repair to"} the damage.`,
      });
    },
    onError(error, variables) {
      console.error(error);
      toast({
        description: `failed to ${variables.isRepaired ? "register repair" : "undo repair register to"} this damage.`,
        variant: "destructive",
      });
    },
  });
  return mutation;
}

export function useDeleteItemDamageMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteDamage,
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey });
      toast({ description: "successfully deleted the damage." });
    },
    onError(error) {
      console.error(error);
      toast({
        description: "failed to delete this damage.",
        variant: "destructive",
      });
    },
  });
  return mutation;
}
