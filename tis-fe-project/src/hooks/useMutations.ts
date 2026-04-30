import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteReading,
  addReading,
  updateReading,
} from "../services/readingsApi";

export const useReadingMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["db"] });

  const deleteMut = useMutation({
    mutationFn: deleteReading,
    onSuccess: invalidate,
  });

  

  const addMut = useMutation({
    mutationFn: addReading,
    onSuccess: invalidate,
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: any) =>
      updateReading(id, data),
    onSuccess: invalidate,
  });

  return {
    deleteReading: deleteMut.mutate,
    addReading: addMut.mutate,
    updateReading: updateMut.mutate,
  };


  
};