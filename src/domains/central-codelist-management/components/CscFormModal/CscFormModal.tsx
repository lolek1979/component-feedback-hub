'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';

import { fetchUsers } from '@/core/api/services/getUsers';
import { formatDateWithDots } from '@/core/auth/utils';
import { useEnv } from '@/core/providers/EnvProvider';
import { Button, Input, Text, Textarea } from '@/design-system/atoms';
import { DatePicker, Modal, RadioGroup } from '@/design-system/molecules';
import { toast } from '@/design-system/molecules/Toast';
import { Person, UsersSelect } from '@/design-system/molecules/UserSelect';

import { Codelist, getCodeLists } from '../../api/services';
import styles from './CscFormModal.module.css';

import { handleFormNavigation } from '@/core';
interface CscFormModalProps {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  onSubmit: (data: CSCFormData, actionType?: 'import' | 'manual' | 'takeover') => void;
  creationType: 'edit' | 'new' | 'import';
  perviousDate?: string;
  presetName?: string;
  state?: string;
  description?: string;
  parentGarants?: string[];
  parentEditors?: string[];
}

interface FormFieldProps {
  label: string;
  id: string;
  placeholder: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  descSubText?: string;
  value?: string;
  disabled?: boolean;
}

export interface CSCFormData {
  cscName: string;
  description: string;
  garants: Person[];
  editors: Person[];
  startDate: string;
  type: string;
}

const FormField = ({
  label,
  id,
  placeholder,
  type = 'text',
  onChange,
  descSubText,
  value,
  disabled = false,
}: FormFieldProps) => (
  <div className={styles.formField}>
    {type === 'textarea' ? (
      <div className={styles.desCaption}>
        <Text variant="subtitle" id="textarea-csc-form-modal-name" regular>
          {label}
        </Text>
        <Text variant="caption">{descSubText}</Text>
      </div>
    ) : (
      <Text variant="label" id="label-csc-form-modal-name" htmlFor="cscName" regular>
        {label}
      </Text>
    )}
    <div className={styles.inputContainer}>
      {type === 'textarea' ? (
        <Textarea
          id={id}
          placeholder={placeholder}
          maxLength={500}
          value={value}
          onChange={onChange}
          initialValue={value}
        />
      ) : (
        <Input
          id={id}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          disabled={disabled}
          autoFocus
        />
      )}
    </div>
  </div>
);

const fetchGarants = async (parentGarants: string[], env: Record<string, string | undefined>) => {
  if (!parentGarants || parentGarants.length === 0) return [];

  const fetchedGarants = await Promise.all(
    parentGarants.map(async (garantName) => {
      const users = await fetchUsers(garantName, false, env);

      return users?.value.find((user: { displayName: string }) => user.displayName === garantName);
    }),
  );

  return fetchedGarants.filter((user) => user !== undefined);
};

const fetchEditors = async (parentEditors: string[], env: Record<string, string | undefined>) => {
  if (!parentEditors || parentEditors.length === 0) return [];
  const fetchedEditors = await Promise.all(
    parentEditors.map(async (editorsName) => {
      const users = await fetchUsers(editorsName, true, env);

      return users?.value.find((user: { displayName: string }) => user.displayName === editorsName);
    }),
  );

  return fetchedEditors.filter((user) => user !== undefined);
};

export const CscFormModal = ({
  isVisible,
  setIsVisible,
  onSubmit,
  creationType = 'new',
  perviousDate,
  presetName,
  state,
  description = '',
  parentGarants,
  parentEditors,
}: CscFormModalProps) => {
  const t = useTranslations('CSCFormModal');
  const tCommon = useTranslations('common');
  const env = useEnv();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { data: codeLists } = useQuery({
    queryKey: ['codeLists'],
    queryFn: () => getCodeLists({ time: 'all' }),
    enabled: isVisible,
  });
  const [selectedType, setSelectedType] = useState(state ?? 'Internal');
  type DataType = 'manual' | 'import' | 'takeover' | undefined;
  const [selectedDataType, setSelectedDataType] = useState<DataType>(
    creationType === 'edit' ? 'takeover' : 'import',
  );
  const [garants, setGarants] = useState<Person[]>([]);
  const [editors, setEditors] = useState<Person[]>([]);
  const [formData, setFormData] = useState<CSCFormData>({
    cscName: presetName ?? '',
    description: description,
    garants: [],
    editors: [],
    startDate: '',
    type: 'Internal',
  });

  const { data: garantsData } = useQuery({
    queryKey: ['garants', parentGarants],
    queryFn: () => fetchGarants(parentGarants || [], env),
    enabled: !!parentGarants && parentGarants.length > 0,
  });

  const { data: editorsData } = useQuery({
    queryKey: ['editors', parentEditors],
    queryFn: () => fetchEditors(parentEditors || [], env),
    enabled: !!parentEditors && parentEditors.length > 0,
  });

  useEffect(() => {
    if (garantsData) {
      setGarants(garantsData);
      if (editorsData) {
        setEditors(editorsData);
      }
    }
  }, [garantsData, editorsData]);

  useEffect(() => {
    if (presetName && state) {
      setFormData((prevData) => ({
        ...prevData,
        cscName: presetName,
        description: description || '',
        type: state,
      }));
    }
  }, [description, presetName, state]);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isVisible]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleGarantChange = (selectedUsers: Person[]) => {
    setGarants(selectedUsers);
    setFormData((prevState) => ({
      ...prevState,
      garants: selectedUsers,
    }));
  };
  const handleEditorChange = (selectedUsers: Person[]) => {
    setEditors(selectedUsers);
    setFormData((prevState) => ({
      ...prevState,
      editors: selectedUsers,
    }));
  };

  const handleDateChange = (id: string, date: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [id]: date,
    }));
  };

  const handleRadioChange = (value: string) => {
    setSelectedType(value);
    setFormData((prevState) => ({
      ...prevState,
      type: value,
    }));
  };

  const isFormEmpty = () => {
    return (
      !formData.cscName.trim() &&
      !formData.description.trim() &&
      formData.garants.length === 0 &&
      formData.editors.length === 0 &&
      !formData.startDate.trim() &&
      !formData.type.trim()
    );
  };

  const checkForDuplicates = (name: string, lists?: Codelist[]): boolean => {
    if (!lists) return false;

    return lists.some(
      (codelist: Codelist) =>
        codelist.versions?.some(
          (version: { name: string }) => version.name.toLowerCase() === name.toLowerCase(),
        ) ||
        codelist.drafts?.some(
          (draft: { name: string }) => draft.name.toLowerCase() === name.toLowerCase(),
        ),
    );
  };

  const handleSubmit = async (actionType?: 'import' | 'manual' | 'takeover') => {
    toast.dismiss();
    const cscMaxTitleLength = 100;
    const cscMaxDescriptionLength = 500;
    const requiredFields = ['cscName', 'garants', 'startDate', 'type'];
    const cscTitle = formData.cscName.trim();
    const cscDescription = formData.description.trim();
    const isFormValid = requiredFields.every((field) => {
      const value = formData[field as keyof typeof formData];

      return typeof value === 'string' ? value.trim() !== '' : value?.length > 0;
    });

    if (isFormEmpty()) {
      toast.error(tCommon('formEmpty'), { id: 'toast-cscFormModal-formEmpty' });

      return;
    }

    if (!isFormValid) {
      toast.error(tCommon('requiredFields'), { id: 'toast-cscFormModal-requiredFields' });

      return;
    }

    const startDate = new Date(formData.startDate);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (startDate <= today) {
      toast.error(tCommon('invalidDate'), { id: 'toast-cscFormModal-invalidDate' });

      return;
    }
    if (creationType === 'new' || creationType === 'import') {
      const isDuplicate = checkForDuplicates(cscTitle, codeLists ?? undefined);
      if (isDuplicate) {
        toast.error(t('duplicateError'), { id: 'toast-cscFormModal-duplicateError' });

        return;
      }
    }

    if (cscTitle.length > cscMaxTitleLength) {
      toast.error(t('nameTooLong'), { id: 'toast-cscFormModal-nameTooLong' });

      return;
    }

    if (cscDescription.length > cscMaxDescriptionLength) {
      toast.error(t('descriptionTooLong'), { id: 'toast-cscFormModal-descriptionTooLong' });

      return;
    }

    const data = {
      ...formData,
      cscName: cscTitle,
    };
    onSubmit(data, actionType);
    setIsVisible(false);
  };

  const handleCloseModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  return (
    <Modal
      id="cscForm-modal"
      size="large"
      closeOnEsc={false}
      closeOnOverlayClick={false}
      setIsVisible={setIsVisible}
      isVisible={isVisible}
    >
      <form onSubmit={(e) => e.preventDefault()} onKeyDown={handleFormNavigation}>
        <div className={styles.modalContent}>
          <Text variant="h4">
            {creationType === 'import'
              ? t('importTitle')
              : creationType === 'new'
                ? t('newTitle')
                : creationType === 'edit'
                  ? t('editTitle')
                  : ''}
          </Text>
          <FormField
            label={t('cscName')}
            id="cscName"
            placeholder={t('cscNamePlaceholder')}
            onChange={handleInputChange}
            value={formData.cscName}
            descSubText={t('maxLength100')}
          />
          <FormField
            label={t('cscDescription')}
            id="description"
            placeholder={t('cscDescriptionPlaceholder')}
            type="textarea"
            value={formData.description}
            descSubText={t('optional')}
            onChange={handleInputChange}
          />
          <div className={styles.formRow}>
            <Text variant="subtitle" regular>
              {t('garant')}
            </Text>
            <div>
              <UsersSelect
                onSelectsChange={handleGarantChange}
                initialUsers={garants}
                id="garant"
                roles={['garant']}
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.desCaption}>
              <Text id="CscFromModalEditor" variant="subtitle" regular>
                {t('editor')}
              </Text>
              <Text variant="subtitle" regular>
                {t('optional')}
              </Text>
            </div>
            <div>
              <UsersSelect
                onSelectsChange={handleEditorChange}
                initialUsers={editors}
                id="editor"
                roles={['editor']}
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <Text variant="subtitle" regular>
              {t('validFor')}
            </Text>
            <div className={styles.datePickerContainer}>
              <DatePicker
                id="datepicker-startDate"
                placeholder={'dd. mm. rrrr'}
                onDateChange={(date) =>
                  handleDateChange('startDate', date ? date.toISOString() : '')
                }
                initialDate={formData.startDate ? new Date(formData.startDate) : undefined}
                minDate={new Date().getFullYear()}
                hasPopoverCalendar
              />
              {creationType === 'edit' ? (
                <div className={styles.dateInfo}>
                  <Text variant="caption" regular>
                    {t('perviousDate')}
                    {perviousDate ? formatDateWithDots(new Date(perviousDate)) : ''}
                  </Text>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className={styles.formRow}>
            <Text variant="subtitle" regular>
              {t('type.title')}
            </Text>
            <div className={styles.radioGroupContainer} id="type">
              <RadioGroup
                key={selectedType}
                options={[
                  { value: 'Internal', label: t('type.internal') },
                  { value: 'InternalPublic', label: t('type.intPublic') },
                  { value: 'InternalPaid', label: t('type.intPaid') },
                  { value: 'External', label: t('type.external') },
                ]}
                name={'typeGroup'}
                onChange={handleRadioChange}
                defaultValue={formData.type}
                className={styles.radioGroup}
                id="radio-group-type-select"
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <Text variant="subtitle" regular>
              {t('data.title')}
            </Text>
            <div className={styles.radioGroupContainer} id="data">
              <RadioGroup
                key={selectedDataType}
                options={[
                  { value: 'import', label: t('data.dataImport') },
                  ...(creationType !== 'edit'
                    ? [{ value: 'manual', label: t('data.dataHand') }]
                    : [{ value: 'takeover', label: t('data.dataTakeover') }]),
                ]}
                name={'dataGroup'}
                onChange={(value) => setSelectedDataType(value as DataType)}
                defaultValue={selectedDataType}
                className={styles.radioGroup}
                id="radio-group-data-select"
              />
            </div>
          </div>
          <div className={styles.buttonGroup}>
            <Button
              id="button-form-modal-close"
              onClick={(e) => handleCloseModal(e)}
              variant="secondary"
            >
              {t('CloseBtn')}
            </Button>

            <Button
              id="button-form-modal-continue"
              onClick={() => handleSubmit(selectedDataType)}
              variant="primary"
            >
              {t('ContinueBtn')}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
