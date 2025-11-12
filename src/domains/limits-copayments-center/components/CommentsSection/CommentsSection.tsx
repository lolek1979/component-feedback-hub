'use client';

import { Textarea } from '@/design-system/atoms';
import { Typography } from '@/design-system/molecules';

import styles from './CommentsSection.module.css';

interface CommentsSectionProps {
  title?: string;
  externalCommentLabel: string;
  externalCommentPlaceholder?: string;
  externalCommentHelper?: string;
  externalCommentValue?: string;
  onExternalCommentChange?: (value: string) => void;
  internalCommentLabel: string;
  internalCommentPlaceholder?: string;
  internalCommentHelper?: string;
  internalCommentValue?: string;
  onInternalCommentChange?: (value: string) => void;
  maxLength?: number;
}

export const CommentsSection = ({
  title,
  externalCommentLabel,
  externalCommentPlaceholder,
  externalCommentHelper,
  externalCommentValue = '',
  onExternalCommentChange,
  internalCommentLabel,
  internalCommentPlaceholder,
  internalCommentHelper,
  internalCommentValue = '',
  onInternalCommentChange,
  maxLength = 100,
}: CommentsSectionProps) => {
  return (
    <div className={styles.container}>
      {title && (
        <Typography variant="Headline/Bold" component="h2">
          {title}
        </Typography>
      )}

      <Textarea
        id="external-comment"
        label={externalCommentLabel}
        value={externalCommentValue}
        onChange={(e) => onExternalCommentChange?.(e.target.value)}
        placeholder={externalCommentPlaceholder}
        helperText={externalCommentHelper}
        maxLength={maxLength}
      />

      <Textarea
        id="internal-comment"
        label={internalCommentLabel}
        value={internalCommentValue}
        onChange={(e) => onInternalCommentChange?.(e.target.value)}
        placeholder={internalCommentPlaceholder}
        helperText={internalCommentHelper}
        maxLength={maxLength}
      />
    </div>
  );
};
