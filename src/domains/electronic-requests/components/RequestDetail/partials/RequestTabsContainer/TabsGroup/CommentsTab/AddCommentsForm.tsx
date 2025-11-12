import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button, Textarea } from '@/design-system/atoms';
import { toast } from '@/design-system/molecules/Toast';
import { useNewRequestComment } from '@/domains/electronic-requests/api/query/Comments/useNewRequestComment';

import styles from '../../RequestTabsContainer.module.css';

interface AddCommentsFormProps {
  requestId: string;
  onSuccess?: () => void;
}

export const AddCommentsForm = ({ requestId, onSuccess }: AddCommentsFormProps) => {
  const tComments = useTranslations('requests.requestDetail.tabs.comments');
  const [commentText, setCommentText] = useState('');

  const { mutate: createComment, isPending } = useNewRequestComment({
    onSuccess: () => {
      setCommentText('');
      toast.success(tComments('toastMessages.success'));
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(tComments('toastMessages.error'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim()) {
      return;
    }

    createComment({
      requestId,
      comment: { text: commentText.trim() },
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.addCommentsForm} aria-label="Add new comment">
      <Textarea
        id="comment-textarea"
        placeholder={tComments('commentsForm.inputPlaceholder')}
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        disabled={isPending}
        ariaLabel="Enter your comment"
        required
      />

      <div className={styles.formActions}>
        <Button
          id="submit-comment-btn"
          type="submit"
          disabled={!commentText.trim() || isPending}
          loading={isPending}
          ariaLabel="Submit comment"
        >
          {tComments('commentsForm.newComment')}
        </Button>
      </div>
    </form>
  );
};
