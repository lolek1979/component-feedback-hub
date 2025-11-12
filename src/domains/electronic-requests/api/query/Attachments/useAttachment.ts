import { useQuery } from '@tanstack/react-query';

import { getAttachment } from '../../services/Attachments/getAttachment';
import { AttachmentModel } from '../../services/types';

interface UseAttachmentOptions extends AttachmentModel {
  enabled?: boolean;
}

export const useAttachment = (options: UseAttachmentOptions) => {
  const { id, fileName, enabled = true } = options;

  return useQuery({
    queryKey: ['attachment', id, fileName],
    queryFn: () => getAttachment(id, fileName),
    enabled,
    placeholderData: (previousData) => previousData,
  });
};
