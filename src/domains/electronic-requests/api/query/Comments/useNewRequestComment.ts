import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

import {
  CommentCreateDTO,
  CommentResponse,
  createNewRequestComment,
} from '@/domains/electronic-requests/api/services/Comments/createNewRequestComment';

interface UseCreateCommentOptions {
  onSuccess?: (
    data: AxiosResponse<CommentResponse>,
    variables: { requestId: string; comment: CommentCreateDTO },
    context: unknown,
  ) => void;
  onError?: (error: AxiosError) => void;
}

export const useNewRequestComment = (options: UseCreateCommentOptions = {}) => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, comment }: { requestId: string; comment: CommentCreateDTO }) => {
      if (!comment.text || comment.text.trim().length === 0) {
        throw new Error('Comment text cannot be empty');
      }

      return createNewRequestComment(requestId, comment);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['request', variables.requestId, 'comments'] });
      queryClient.invalidateQueries({ queryKey: ['request', variables.requestId] });

      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    onError: (error: AxiosError) => {
      if (onError) {
        onError(error);
      }
    },
  });
};
