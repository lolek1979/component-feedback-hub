import { useTranslations } from 'next-intl';

import { IInfo } from '@/core/assets/icons';

import { AddCommentsForm } from './AddCommentsForm';

import { InlineMessage } from '@/design-system';

interface CommentsTabProps {
  requestId: string;
}

export const CommentsTab = ({ requestId }: CommentsTabProps) => {
  const t = useTranslations('requests.requestDetail.tabs.comments');

  return (
    <div>
      <InlineMessage
        id="inline-message-empty-requests"
        icon={<IInfo id="icon-table-inline-empty-requests" width={20} height={20} />}
        centeredText
        message={t('noDataMessage')}
      />
      <AddCommentsForm requestId={requestId} />
    </div>
  );
};
