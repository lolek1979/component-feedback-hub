import SaveAndPublishIcon from '@/core/assets/icons/circle_check.svg';
import DeleteIcon from '@/core/assets/icons/delete_forever.svg';
import EditIcon from '@/core/assets/icons/edit.svg';
import CopyIcon from '@/core/assets/icons/icon_copy.svg';
import SaveIcon from '@/core/assets/icons/icon_save.svg';
import IClose from '@/core/assets/icons/icon-close.svg';
import LinkIcon from '@/core/assets/icons/icon-link.svg';
import SuccessIcon from '@/core/assets/icons/icon-success.svg';
import { Button, Tooltip } from '@/design-system/atoms';

interface CSCButtonProps {
  title: string;
  text: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  isValid?: boolean;
  tooltipText?: string;
}

const CopyLinkButton = ({ text, onClick, className, ariaLabel, title }: CSCButtonProps) => (
  <Button
    variant="secondary"
    id="button-csc-header-copy"
    title={title}
    icon={<LinkIcon id="icon-csc-header-copy" width={24} height={24} className="icon_black" />}
    onClick={onClick}
    className={className}
    ariaLabel={ariaLabel}
  >
    {text}
  </Button>
);

const SaveConceptButton = ({
  text,
  onClick,
  className,
  ariaLabel,
  disabled,
  title,
  isValid,
  tooltipText,
}: CSCButtonProps) => {
  return (
    <>
      {isValid ? (
        <Button
          variant="primary"
          id="button-csc-header-save"
          title={title}
          icon={
            <SaveIcon id="icon-csc-header-save" width={24} height={24} className="icon_white" />
          }
          onClick={onClick}
          className={className}
          ariaLabel={ariaLabel}
          disabled={disabled}
          aria-disabled={disabled}
        >
          {text}
        </Button>
      ) : (
        <Tooltip
          variant="inverse"
          placement="tooltipTop"
          content={tooltipText}
          id="tooltip-csc-header-save-button"
        >
          <Button
            variant="primary"
            id="button-csc-header-save"
            title={title}
            icon={
              <SaveIcon id="icon-csc-header-copy" width={24} height={24} className="icon_white" />
            }
            onClick={onClick}
            className={className}
            ariaLabel={ariaLabel}
            disabled={disabled}
            aria-disabled={disabled}
          >
            {text}
          </Button>
        </Tooltip>
      )}
    </>
  );
};

const SaveAndPublishConceptButton = ({
  text,
  onClick,
  className,
  ariaLabel,
  disabled,
  title,
  isValid,
  tooltipText,
}: CSCButtonProps) => {
  return (
    <>
      {isValid ? (
        <Button
          variant="secondary"
          id="button-csc-header-save-and-publish"
          title={title}
          icon={
            <SaveAndPublishIcon
              id="icon-csc-header-save-and-publish"
              width={24}
              height={24}
              className="icon_black"
            />
          }
          onClick={onClick}
          className={className}
          ariaLabel={ariaLabel}
          disabled={disabled}
          aria-disabled={disabled}
        >
          {text}
        </Button>
      ) : (
        <Tooltip
          variant="inverse"
          placement="tooltipTop"
          content={tooltipText}
          id="tooltip-csc-header-save-publish-button"
        >
          <Button
            variant="primary"
            id="button-csc-header-save-and-publish"
            title={title}
            icon={
              <SaveAndPublishIcon
                id="icon-csc-header-save-and-publish"
                width={24}
                height={24}
                className="icon_white"
              />
            }
            onClick={onClick}
            className={className}
            ariaLabel={ariaLabel}
            disabled={disabled}
            aria-disabled={disabled}
          >
            {text}
          </Button>{' '}
        </Tooltip>
      )}
    </>
  );
};
const SaveAndSendForApprovalConceptButton = ({
  text,
  onClick,
  className,
  ariaLabel,
  disabled,
  title,
  isValid,
  tooltipText,
}: CSCButtonProps) => {
  return (
    <>
      {isValid ? (
        <Button
          variant="secondary"
          id="button-csc-header-save-and-publish"
          title={title}
          icon={
            <SaveAndPublishIcon
              id="icon-csc-header-save-and-publish"
              width={24}
              height={24}
              className="icon_black"
            />
          }
          onClick={onClick}
          className={className}
          ariaLabel={ariaLabel}
          disabled={disabled}
          aria-disabled={disabled}
        >
          {text}
        </Button>
      ) : (
        <Tooltip
          variant="inverse"
          placement="tooltipTop"
          content={tooltipText}
          id="tooltip-csc-header-save-publish-button"
        >
          <Button
            variant="primary"
            id="button-csc-header-save-and-publish"
            title={title}
            icon={
              <SaveAndPublishIcon
                id="icon-csc-header-save-and-publish"
                width={24}
                height={24}
                className="icon_white"
              />
            }
            onClick={onClick}
            className={className}
            ariaLabel={ariaLabel}
            disabled={disabled}
            aria-disabled={disabled}
          >
            {text}
          </Button>{' '}
        </Tooltip>
      )}
    </>
  );
};
const SendForApprovalConceptButton = ({
  text,
  onClick,
  className,
  ariaLabel,
  disabled,
  title,
  isValid,
  tooltipText,
}: CSCButtonProps) => {
  return (
    <>
      {isValid ? (
        <Button
          variant="primary"
          id="button-csc-header-save-and-publish"
          title={title}
          icon={
            <SaveAndPublishIcon
              id="icon-csc-header-save-and-publish"
              width={24}
              height={24}
              className="icon_white"
            />
          }
          onClick={onClick}
          className={className}
          ariaLabel={ariaLabel}
          disabled={disabled}
          aria-disabled={disabled}
        >
          {text}
        </Button>
      ) : (
        <Tooltip
          variant="inverse"
          placement="tooltipTop"
          content={tooltipText}
          id="tooltip-csc-header-save-publish-button"
        >
          <Button
            variant="primary"
            id="button-csc-header-save-and-publish"
            title={title}
            icon={
              <SaveAndPublishIcon
                id="icon-csc-header-save-and-publish"
                width={24}
                height={24}
                className="icon_white"
              />
            }
            onClick={onClick}
            className={className}
            ariaLabel={ariaLabel}
            disabled={disabled}
            aria-disabled={disabled}
          >
            {text}
          </Button>{' '}
        </Tooltip>
      )}
    </>
  );
};

const PublishConceptButton = ({
  text,
  onClick,
  className,
  ariaLabel,
  disabled,
  title,
}: CSCButtonProps) => (
  <Button
    variant="primary"
    id="button-csc-header-publish"
    title={title}
    icon={
      <SuccessIcon id="icon-csc-header-publish" width={24} height={24} className="icon_white" />
    }
    onClick={onClick}
    className={className}
    ariaLabel={ariaLabel}
    disabled={disabled}
    aria-disabled={disabled}
  >
    {text}
  </Button>
);
const DepublishConceptButton = ({
  text,
  onClick,
  className,
  ariaLabel,
  disabled,
  title,
}: CSCButtonProps) => (
  <Button
    id="button-csc-header-depublish"
    title={title}
    variant="secondary"
    icon={<IClose id="icon-csc-header-depublish" width={16} height={16} className="icon_black" />}
    onClick={onClick}
    className={className}
    ariaLabel={ariaLabel}
    aria-disabled={disabled}
    disabled={disabled}
  >
    {text}
  </Button>
);
const ReturnToReworkConceptButton = ({
  text,
  onClick,
  className,
  ariaLabel,
  disabled,
  title,
}: CSCButtonProps) => (
  <Button
    id="button-csc-header-return-to-rework"
    title={title}
    variant="secondary"
    icon={
      <IClose id="icon-csc-header-return-to-rework" width={16} height={16} className="icon_black" />
    }
    onClick={onClick}
    className={className}
    ariaLabel={ariaLabel}
    aria-disabled={disabled}
    disabled={disabled}
  >
    {text}
  </Button>
);

const EditConceptButton = ({
  text,
  onClick,
  className,
  disabled,
  ariaLabel,
  title,
}: CSCButtonProps) => (
  <Button
    id="button-csc-header-edit"
    title={title}
    variant="secondary"
    icon={<EditIcon id="icon-csc-header-edit" width={22} height={22} className="icon_black" />}
    onClick={onClick}
    className={className}
    disabled={disabled}
    ariaLabel={ariaLabel}
    aria-disabled={disabled}
  >
    {text}
  </Button>
);

const DeleteButton = ({ text, onClick, className, ariaLabel, disabled, title }: CSCButtonProps) => (
  <Button
    id="button-csc-header-delete"
    title={title}
    variant="secondary"
    icon={<DeleteIcon id="icon-csc-header-delete" width={24} height={24} />}
    onClick={onClick}
    className={className}
    ariaLabel={ariaLabel}
    disabled={disabled}
    aria-disabled={disabled}
  >
    {text}
  </Button>
);

const NewVersionButton = ({
  text,
  onClick,
  className,
  ariaLabel,
  disabled,
  title,
}: CSCButtonProps) => (
  <Button
    id="button-csc-header-new-version"
    title={title}
    variant="secondary"
    icon={
      <CopyIcon id="icon-csc-header-new-version" width={24} height={24} className="icon_black" />
    }
    onClick={onClick}
    className={className}
    ariaLabel={ariaLabel}
    disabled={disabled}
    aria-disabled={disabled}
  >
    {text}
  </Button>
);

export {
  CopyLinkButton,
  DeleteButton,
  DepublishConceptButton,
  EditConceptButton,
  NewVersionButton,
  PublishConceptButton,
  ReturnToReworkConceptButton,
  SaveAndPublishConceptButton,
  SaveAndSendForApprovalConceptButton,
  SaveConceptButton,
  SendForApprovalConceptButton,
};
