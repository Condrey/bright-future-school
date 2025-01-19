import { toast } from "@/hooks/use-toast";
import { ClassStreamData, ClassTeacherWithYearData } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { assignClassTeacher, unAssignClassTeacher } from "./action";

export function useAssignClassTeacherMutation(year?: string) {
  const queryKey: QueryKey = ["year-class-streams", year || null];

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: assignClassTeacher,
    async onSuccess(modifiedClassStream) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<ClassStreamData[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return oldData.map((d) =>
          d.id === modifiedClassStream.id ? modifiedClassStream : d,
        );
      });
      //For class teacher
      const returnedClassTeacher = modifiedClassStream.classTeacher;
      if (!returnedClassTeacher) return;
      queryClient.setQueryData<ClassTeacherWithYearData[]>(
        ["class-teachers"],
        (oldData) =>
          oldData &&
          oldData.map((d) =>
            d.id === returnedClassTeacher.id
              ? {
                  ...d,
                  user: returnedClassTeacher.user,
                }
              : d,
          ),
      );
      queryClient.invalidateQueries({ queryKey: ["class-teachers"] });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to add classStream, please try again.!",
      });
    },
  });

  return mutation;
}

export function useUnassignClassTeacherMutation(year?: string) {
  const queryKey: QueryKey = ["year-class-streams", year || null];

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: unAssignClassTeacher,
    async onSuccess(modifiedClassStream, variables) {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<ClassStreamData[]>(queryKey, (oldData) => {
        if (!oldData) return;
        return oldData.map((d) =>
          d.id === modifiedClassStream.id ? modifiedClassStream : d,
        );
      });
      //For class teacher

      queryClient.setQueryData<ClassTeacherWithYearData[]>(
        ["class-teachers"],
        (oldData) =>
          oldData &&
          oldData.map((d) =>
            d.id === variables.classTeacherId
              ? {
                  ...d,
                  user: null,
                }
              : d,
          ),
      );

      queryClient.invalidateQueries({ queryKey: ["class-teachers"] });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to add classStream, please try again.!",
      });
    },
  });

  return mutation;
}
