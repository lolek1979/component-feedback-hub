import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createAttachment } from '../../services/Attachments/createAttachment';

export const useCreateAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => {
      return createAttachment(file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments'] });
    },
    onError: (error) => {
      console.error('Failed to create attachment:', error);
    },
  });
};
