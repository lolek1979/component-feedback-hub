import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';

import Ipencil from '@/core/assets/icons/pencil.svg';
import { Badge, Button, Text, Textarea } from '@/design-system/atoms';
import { DatePicker, Modal, Tag, UsersInfo } from '@/design-system/molecules';
import { toast } from '@/design-system/molecules/Toast';
import { Person, UsersSelect } from '@/design-system/molecules/UserSelect';
import {
  CodeListByIdResponse,
  postCodelistAddGarant,
  postCodeListRemoveGarant,
  postDraftAddEditor,
  postDraftAddGarant,
  postDraftRemoveEditor,
  postDraftRemoveGarant,
  putDraftUpdates,
  Users,
} from '@/domains/central-codelist-management/api/services';
import { DraftsByIdResponse } from '@/domains/central-codelist-management/api/services/getDraftsById';
import { Payload } from '@/domains/central-codelist-management/api/services/putDraftUpdate';
import useCSCAuth from '@/domains/central-codelist-management/hooks/useCSCAuth';

import styles from './DetailsTab.module.css';

interface DetailsTabProps {
  data: CodeListByIdResponse | DraftsByIdResponse | null;
  status?: string;
  codeListId: string;
  parentId: string;
}
const mapUsersToPersons = (users: Users[] = []): Person[] => {
  return users.map((user) => ({
    id: user.id || '',
    displayName: user.fullName || '',
    mail: user.mail || '',
    mobilePhone: '',
    givenName: user.fullName || '',
    surname: user.department || '',
  }));
};

export const DetailsTab = ({ data, status, codeListId, parentId }: DetailsTabProps) => {
  const payload: Partial<CodeListByIdResponse['payload'] | DraftsByIdResponse> =
    data && 'payload' in data ? data.payload : (data ?? {});
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isDesModalVisible, setIsDesModalVisible] = useState<boolean>(false);
  const [isValidityFromModalVisible, setIsValidityFromModalVisible] = useState<boolean>(false);
  const [garants, setGarants] = useState<Person[]>(mapUsersToPersons(payload.garants));
  const [isEditor, setIsEditor] = useState<boolean>(false);
  const [editor, setEditors] = useState<Person[]>(mapUsersToPersons(payload.editors));
  const tCommon = useTranslations('common');
  const tStates = useTranslations('statuses');
  const statusName = status ? tStates(status) : '';
  const isConcept = status === 'concept';
  const isWaitingForapproval = status === 'waitingforapproval';
  const queryClient = useQueryClient();
  const t = useTranslations('CSCTabsContainer.detailsTab');

  const {
    name: title = '',
    description,
    id: identifier,
    garants: guarantors = [],
    editors: editors = [],
    versionType: type = '',
    validFrom: validity = '',
  } = payload;

  const [formData, setFormData] = useState<Payload>({
    description: description ?? '',
    name: title,
    codeListId: parentId,
    validFrom: validity,
    code: null,
    versionType: type,
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>();
  const { isEditAuth, isPublisherAuth, isLoading } = useCSCAuth(codeListId, status);
  const todayMidnightLocal = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);

    return d;
  }, []);

  useEffect(() => {
    if (isValidityFromModalVisible) {
      if (selectedDate) {
        if (selectedDate > todayMidnightLocal) {
          setFormData(
            (prev) =>
              ({
                ...prev,
                validFrom: selectedDate.toISOString(),
              }) as Payload,
          );
        } else {
          toast.error(tCommon('invalidDate'));
        }
      }
    }
  }, [selectedDate, tCommon, isValidityFromModalVisible, todayMidnightLocal]);

  if (isLoading) {
    return;
  }
  const handleDateChange = (date: string) => {
    setSelectedDate(new Date(date));
  };

  const handleGarantChange = (selectedUsers: Person[]) => {
    setGarants(selectedUsers);
  };

  const handleEditorChange = (selectedUsers: Person[]) => {
    setEditors(selectedUsers);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      description: value,
    }));
  };

  const handleEditUsers = async () => {
    const filteredGarantsAdd = garants
      .filter((garant) => !guarantors.some((user) => user.id === garant.id))
      .map((garant) => garant.id);
    const filteredEditorsAdd = editor
      .filter((editor) => !editors.some((user) => user.id === editor.id))
      .map((editor) => editor.id);

    const filteredGarantsRemove = guarantors
      .filter((user) => !garants.some((garant) => garant.id === user.id))
      .map((user) => user.id);
    const filteredEditorsRemove = editors
      .filter((user) => !editor.some((editor) => editor.id === user.id))
      .map((user) => user.id);

    if (!garants.length) {
      toast.error(tCommon('errorEmptyGuarantors'), { id: 'toast-details-tab-empty-guarantors' });

      return;
    }

    if (isConcept || isWaitingForapproval) {
      filteredEditorsAdd.length > 0 && (await postDraftAddEditor(codeListId, filteredEditorsAdd));
      filteredEditorsRemove.length > 0 &&
        (await postDraftRemoveEditor(codeListId, filteredEditorsRemove));
      filteredGarantsAdd.length > 0 && (await postDraftAddGarant(codeListId, filteredGarantsAdd));
      filteredGarantsRemove.length > 0 &&
        (await postDraftRemoveGarant(codeListId, filteredGarantsRemove));
    } else {
      filteredGarantsAdd.length > 0 &&
        (await postCodelistAddGarant(codeListId, filteredGarantsAdd));
      filteredGarantsRemove.length > 0 &&
        (await postCodeListRemoveGarant(codeListId, filteredGarantsRemove));
    }
    setIsModalVisible(false);
    queryClient.invalidateQueries();
  };

  const isSelectedDateInPast = (): boolean => {
    return !selectedDate || selectedDate <= todayMidnightLocal;
  };

  const handleEditValidity = async () => {
    await putDraftUpdates(codeListId, formData);
    setIsValidityFromModalVisible(false);
    queryClient.invalidateQueries();
  };

  const handleEditDescription = async () => {
    await putDraftUpdates(codeListId, formData);

    setIsDesModalVisible(false);
    queryClient.invalidateQueries();
  };

  const canShowForConcept = isConcept && (isPublisherAuth || isEditAuth);
  const canShowForApproval = isWaitingForapproval && isPublisherAuth;
  const canShowButton = canShowForConcept || canShowForApproval;

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <Text variant="subtitle" regular className={styles.label}>
          {t('title')}
        </Text>
        <div className={styles.valueContainer}>
          <Text variant="subtitle" className={styles.value}>
            {title}
          </Text>
        </div>
      </div>
      <div className={styles.row}>
        <Text variant="subtitle" regular className={styles.label}>
          {t('description')}
        </Text>
        <div className={styles.valueContainer}>
          <Text variant="subtitle" className={styles.value}>
            {description}
          </Text>
          {canShowForConcept && (
            <Button
              size="small"
              variant="secondary"
              onClick={() => setIsDesModalVisible(true)}
              id="button-details-tab-edit-description"
              className={styles.editButton}
            >
              <Ipencil id={'icon-details-tab-edit-description'} width={22} height={22} />
            </Button>
          )}
        </div>
      </div>
      <div className={styles.row}>
        <Text variant="subtitle" regular className={styles.label}>
          {t('guarantor')}
        </Text>
        <div className={styles.valueContainer}>
          <div className={styles.value}>
            <UsersInfo users={guarantors?.map((item) => item) || []} />
          </div>
          {canShowButton && (
            <Button
              size="small"
              variant="secondary"
              onClick={() => (setIsModalVisible(true), setIsEditor(false))}
              id="button-details-tab-edit-guarantors"
              className={styles.editButton}
            >
              <Ipencil id={'icon-details-tab-edit-guarantors'} width={22} height={22} />
            </Button>
          )}
        </div>
      </div>
      <div className={styles.row}>
        <Text variant="subtitle" regular className={styles.label}>
          {t('editor')}
        </Text>
        <div className={styles.valueContainer}>
          <div className={styles.value}>
            <UsersInfo users={editors?.map((item) => item) || []} />
          </div>
          {canShowButton && (
            <Button
              size="small"
              variant="secondary"
              onClick={() => (setIsModalVisible(true), setIsEditor(true))}
              id="button-details-tab-edit-editors"
              className={styles.editButton}
            >
              <Ipencil id={'icon-details-tab-edit-editors'} width={22} height={22} />
            </Button>
          )}
        </div>
      </div>
      <div className={styles.row}>
        <Text variant="subtitle" regular className={styles.label}>
          {t('validity')}
        </Text>
        <div className={styles.valueContainer}>
          <Text variant="subtitle" className={styles.value}>
            {new Date(validity).toLocaleDateString('cs-CZ')}
          </Text>
          {canShowForConcept && (
            <Button
              size="small"
              variant="secondary"
              onClick={() => setIsValidityFromModalVisible(true)}
              id="button-details-tab-edit-validity"
              className={styles.editButton}
            >
              <Ipencil id={'icon-details-tab-edit-validity'} width={24} height={24} />
            </Button>
          )}
        </div>
      </div>
      <div className={styles.row}>
        <Text variant="subtitle" regular className={styles.label}>
          {t('identifier')}
        </Text>
        <div className={styles.valueContainer}>
          <Text variant="subtitle" className={styles.value}>
            {identifier}
          </Text>
        </div>
      </div>
      <div className={styles.row}>
        <Text variant="subtitle" regular className={styles.label}>
          {t('type')}
        </Text>
        <div className={styles.valueContainer}>
          <div className={styles.value}>
            <div className={styles.tags}>
              {type === 'Internal' ? (
                <Badge>Interní</Badge>
              ) : type === 'InternalPaid' ? (
                <Badge>Interní - Placený</Badge>
              ) : type === 'InternalPublic' ? (
                <Badge>Interní - Veřejný</Badge>
              ) : type === 'External' ? (
                <Badge>Externí</Badge>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.row}>
        <Text variant="subtitle" regular className={styles.label}>
          {t('status')}
        </Text>
        <div className={styles.valueContainer}>
          <div className={styles.value}>
            <Tag id={'tag-details-tab-' + statusName} variant={status || ''}>
              {statusName}
            </Tag>
          </div>
        </div>
      </div>
      <Modal
        id="details-tab-user-modal"
        title={isEditor ? t('editorTitle') : t('guarantorTitle')}
        size="medium"
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
      >
        <div className={styles.garantContainer}>
          <UsersSelect
            roles={[isEditor ? 'editor' : 'garant']}
            id={isEditor ? 'editor' : 'garant'}
            onSelectsChange={isEditor ? handleEditorChange : handleGarantChange}
            initialUsers={
              isEditor ? mapUsersToPersons(payload.editors) : mapUsersToPersons(payload.garants)
            }
          />
        </div>
        <div className={styles.buttonContainer}>
          <Button
            id="button-details-tab-close"
            onClick={() => setIsModalVisible(false)}
            variant="secondary"
          >
            {tCommon('close')}
          </Button>
          <Button id="button-details-tab-save" onClick={() => handleEditUsers()} variant="primary">
            {tCommon('save')}
          </Button>
        </div>
      </Modal>
      <Modal
        id="details-tab-description-modal"
        title={t('descriptionTitle')}
        size="medium"
        isVisible={isDesModalVisible}
        setIsVisible={setIsDesModalVisible}
      >
        <div className={styles.areaContainer}>
          <Textarea
            id="textarea-details-tab-input"
            placeholder={t('textarea')}
            onChange={handleInputChange}
            value={formData.description}
            maxLength={500}
          />
        </div>
        <div className={styles.buttonContainer}>
          <Button
            id="button-details-tab-close"
            onClick={() => setIsDesModalVisible(false)}
            variant="secondary"
          >
            {tCommon('close')}
          </Button>
          <Button
            id="button-details-tab-save"
            onClick={() => handleEditDescription()}
            variant="primary"
          >
            {tCommon('save')}
          </Button>
        </div>
      </Modal>
      <Modal
        id="details-tab-validity-from-modal"
        title={t('validity')}
        size="medium"
        isVisible={isValidityFromModalVisible}
        setIsVisible={setIsValidityFromModalVisible}
      >
        <div className={styles.datePickerContainer}>
          <DatePicker
            id="datepicker-validity-from"
            placeholder={new Date().toLocaleDateString('cs-CZ')}
            onDateChange={(date) => handleDateChange(date ? date.toISOString() : '')}
            minDate={new Date().getFullYear()}
            hasPopoverCalendar
          />
        </div>
        <div className={styles.buttonContainer}>
          <Button
            id="button-details-tab-close"
            onClick={() => setIsValidityFromModalVisible(false)}
            variant="secondary"
          >
            <Text variant="subtitle">{tCommon('close')}</Text>
          </Button>
          <Button
            id="button-details-tab-save"
            disabled={isSelectedDateInPast()}
            onClick={() => handleEditValidity()}
            variant="primary"
          >
            <Text variant="subtitle">{tCommon('save')}</Text>
          </Button>
        </div>
      </Modal>
    </div>
  );
};
