"use client";

import { directorDashboardParamsQueryKey } from "@/app/(director)/hook";
import { toast } from "@/hooks/use-toast";
import kyInstance from "@/lib/ky";
import { DirectorDashboardParam } from "@/lib/types";
import { StreamSchema } from "@/lib/validation";
import { Stream } from "@prisma/client";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

const queryKey: QueryKey = ["streams"];

export function useAddStreamMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: StreamSchema) =>
      kyInstance
        .post("/api/streams", {
          body: JSON.stringify(input),
        })
        .json<Stream>(),
    async onSuccess(addedStream) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<Stream[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return [...oldData, addedStream];
      });

      //For dashboard
      queryClient.setQueryData<DirectorDashboardParam>(
        directorDashboardParamsQueryKey,
        (oldData) => oldData && { ...oldData, streams: oldData.streams + 1 },
      );

      // queryClient.invalidateQueries({ queryKey });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to add stream, please try again.!",
      });
    },
  });

  return mutation;
}

export function useUpdateStreamMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: StreamSchema) =>
      kyInstance
        .put("/api/streams", {
          body: JSON.stringify(input),
        })
        .json<Stream>(),
    async onSuccess(updatedStream) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<Stream[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return oldData.map((d) =>
          d.id === updatedStream.id ? updatedStream : d,
        );
      });

      // queryClient.invalidateQueries({ queryKey });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update stream, please try again.!",
      });
    },
  });

  return mutation;
}

export function useDeleteStreamMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id:string) =>
      kyInstance
        .delete("/api/streams", {
          body: JSON.stringify({id}),
        })
        .json<string>(),
    async onSuccess(id) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<Stream[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return oldData.filter((d) => d.id !== id);
      });
      //For dashboard
      queryClient.setQueryData<DirectorDashboardParam>(
        directorDashboardParamsQueryKey,
        (oldData) => oldData && { ...oldData, streams: oldData.streams - 1 },
      );

      // queryClient.invalidateQueries({ queryKey });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to delete stream, please try again.!",
      });
    },
  });

  return mutation;
}
