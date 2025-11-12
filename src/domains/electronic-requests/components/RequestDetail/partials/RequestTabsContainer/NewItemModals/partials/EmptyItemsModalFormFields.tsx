import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import { CSCCategory } from '@/domains/electronic-requests/api/services/CSC/types';
import { AdminContract } from '@/domains/electronic-requests/api/services/types';

import { FileUploadField } from './FileUploadField';
import { FormRow } from './FormRow';
import { NumericInput } from './NumericInput';
import { EmptyItemsModalFormFieldsProps, getErrorMessage } from './utils';

import {
  Badge,
  DatePicker,
  Divider,
  Input,
  Option,
  Select,
  Text,
  Textarea,
  Typography,
} from '@/design-system';

export const EmptyItemsModalFormFields = ({
  form,
  config,
  translations,
  isFromCatalogue,
}: EmptyItemsModalFormFieldsProps) => {
  const {
    control,
    errors,
    watch,
    setValue,
    uploadedFiles,
    setUploadedFiles,
    handleDateChange,
    calculateTotalPrice,
    getCurrentUnit,
    amountTypes,
    inputReadonly,
    categoriesData,
    contractsData,
    isLoadingCategories,
    isLoadingContracts,
    unitPrice,
    quantity,
  } = form;

  const { FILE_UPLOAD_CONFIG, styles } = config;
  const { MAX_FILE_SIZE_MB, MAX_FILES, ALLOWED_FILE_TYPES } = FILE_UPLOAD_CONFIG;
  const { tLabels } = translations;
  const tItemModal = useTranslations('requests.requestDetail.tabs.items.emptyItemsModal');
  const tFileUpload = useTranslations(
    'requests.requestDetail.tabs.items.emptyItemsModal.fileUpload',
  );

  return (
    <>
      <div>
        <Typography variant="Headline/Bold" className={styles.basicInfoTitle}>
          {tItemModal('basicInfo')}
        </Typography>
        <FormRow label={tLabels('title')}>
          {!isFromCatalogue ? (
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  id="input-modal-title"
                  {...field}
                  error={!!errors.title}
                  helperText={getErrorMessage(errors.title?.message)}
                  maxLength={30}
                  className={styles.inputField}
                  disabled={inputReadonly}
                />
              )}
            />
          ) : (
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Text id="text-modal-title" variant="subtitle">
                  {field.value}
                </Text>
              )}
            />
          )}
        </FormRow>
        <Divider variant="dotted" />
        <FormRow label={tLabels('description')} required={false} className={styles.descriptionRow}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                id="textarea-modal-description"
                {...field}
                helperText={getErrorMessage(errors.description?.message)}
                maxLength={300}
                className={styles.inputField}
                disabled={inputReadonly}
              />
            )}
          />
        </FormRow>
        <Divider variant="dotted" />
        {!isFromCatalogue && (
          <FormRow label={tLabels('measureUnit')}>
            <Controller
              name="measureUnit"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  id="select-modal-measure-unit"
                  value={value}
                  defaultValue="Ks"
                  onChange={onChange}
                  helperText={getErrorMessage(errors.measureUnit?.message)}
                  className={styles.inputField}
                  disabled={inputReadonly}
                >
                  {Object.entries(amountTypes).map(([key, unit]) => (
                    <Option key={key} value={key}>
                      {unit as React.ReactNode}
                    </Option>
                  ))}
                </Select>
              )}
            />
          </FormRow>
        )}
        <Divider variant="dotted" />
        <FormRow label={tLabels('amount')}>
          <Controller
            name="quantity"
            control={control}
            render={({ field: { onChange, value } }) => (
              <NumericInput
                id="input-modal-amount"
                value={value}
                onChange={(val: string) => {
                  const numericValue = parseFloat(val);
                  onChange(numericValue);
                }}
                currency={getCurrentUnit()}
                error={!!errors.quantity}
                helperText={getErrorMessage(errors.quantity?.message)}
                maxLength={4}
                className={styles.inputField}
                disabled={inputReadonly}
                allowDecimals={false}
                useSpaceSeparators={false}
              />
            )}
          />
        </FormRow>
        <Divider variant="dotted" />
        <FormRow label={tLabels('priceWithVAT')}>
          {!isFromCatalogue ? (
            <Controller
              name="unitPrice"
              control={control}
              render={({ field: { onChange, value } }) => (
                <NumericInput
                  id="input-modal-price"
                  value={value}
                  onChange={(val: string) => {
                    const numericValue = parseFloat(val);
                    onChange(numericValue);
                  }}
                  currency="Kč"
                  error={!!errors.unitPrice}
                  helperText={getErrorMessage(errors.unitPrice?.message)}
                  maxLength={7}
                  className={styles.inputField}
                  disabled={inputReadonly}
                  allowDecimals={true}
                  useSpaceSeparators={true}
                />
              )}
            />
          ) : (
            <Controller
              name="unitPrice"
              control={control}
              render={({ field }) => (
                <div className={styles.priceValueText}>
                  <Text id="modal-price-value" variant="subtitle">
                    {field.value}
                  </Text>
                </div>
              )}
            />
          )}
          <Text variant="caption" color="tertiary" className={styles.totalText}>
            {tLabels('total')} {quantity} {getCurrentUnit()}{' '}
            {calculateTotalPrice(unitPrice, quantity)}
          </Text>
        </FormRow>
        <Divider variant="dotted" />
        <FormRow label={tLabels('contract')}>
          {isFromCatalogue ? (
            <Select
              id="select-modal-contract"
              value="withoutContract"
              className={styles.inputField}
            >
              <Option value="withoutContract">{tLabels('noContract')}</Option>
            </Select>
          ) : (
            <Controller
              name="contract"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  id="select-modal-contract"
                  value={value}
                  onChange={onChange}
                  disabled={isLoadingContracts || inputReadonly}
                  className={styles.inputField}
                >
                  {contractsData?.items && contractsData.items.length > 0 ? (
                    contractsData.items.map((contract: AdminContract) => (
                      <Option key={contract.id} value={contract.id.toString()}>
                        {contract.description}
                      </Option>
                    ))
                  ) : (
                    <Option value="" disabled>
                      {tLabels('noContract')}
                    </Option>
                  )}
                </Select>
              )}
            />
          )}
        </FormRow>
        <Controller
          name="numberInSAP"
          control={control}
          render={({ field }) =>
            field.value && field.value.trim() !== '' ? (
              <FormRow label={tLabels('numberInSAP')}>
                <Text id="text-modal-sap-number" variant="subtitle">
                  {field.value}
                </Text>
              </FormRow>
            ) : (
              <></>
            )
          }
        />
        <Divider variant="dotted" />
        <FormRow label={tLabels('category')}>
          {isFromCatalogue ? (
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => {
                const selectedCategory = categoriesData?.payload.items?.find(
                  (cat: CSCCategory) => cat.id.toString() === field.value,
                );

                return (
                  <Text id="text-modal-category" variant="subtitle">
                    {selectedCategory ? selectedCategory.description : ''}
                  </Text>
                );
              }}
            />
          ) : (
            <Controller
              name="categoryId"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  id="select-modal-category"
                  value={value}
                  onChange={onChange}
                  disabled={isLoadingCategories || inputReadonly}
                  helperText={getErrorMessage(errors.categoryId?.message)}
                  className={styles.inputField}
                >
                  {categoriesData?.payload.items && categoriesData.payload.items.length > 0 ? (
                    categoriesData.payload.items.map((category: CSCCategory) => (
                      <Option key={category.id} value={category.id.toString()}>
                        {category.description}
                      </Option>
                    ))
                  ) : (
                    <Option value="" disabled>
                      {tLabels('noCategory')}
                    </Option>
                  )}
                </Select>
              )}
            />
          )}
        </FormRow>
        <Divider variant="dotted" />
        <FormRow label={tLabels('expectedDeliveryDate')}>
          <Controller
            name="expectedDeliveryDate"
            control={control}
            render={({ field }) => (
              //TODO: Handle the past date prevention
              <div className={`${styles.datePickerContainer} ${styles.inputField}`}>
                <DatePicker
                  id="datepicker-modal-delivery-date"
                  placeholder={new Date().toLocaleDateString()}
                  onDateChange={(date: Date | null) =>
                    handleDateChange('expectedDeliveryDate', date ? date.toISOString() : '')
                  }
                  initialDate={field.value ? new Date(field.value) : null}
                  minDate={new Date().getFullYear()}
                  hasPopoverCalendar
                  disabled={inputReadonly}
                />
              </div>
            )}
          />
        </FormRow>
        <Divider variant="dotted" />
        <FormRow label={tLabels('status')}>
          <Badge id="badge-modal-status">{tLabels('newStatus')}</Badge>
        </FormRow>
      </div>

      <div>
        <div className={styles.attachmentsHeader}>
          <Typography variant="Headline/Bold">{tItemModal('attachments')}</Typography>
          <Badge>{uploadedFiles.length}</Badge>
          <Typography variant="Subtitle/Default/Regular" className={styles.notRequiredText}>
            ({tItemModal('fieldsLabels.notRequired')})
          </Typography>
        </div>
        <FileUploadField
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
          setValue={setValue}
          watch={watch}
          readonly={inputReadonly}
          maxFiles={MAX_FILES}
          maxFileSizeMB={MAX_FILE_SIZE_MB}
          allowedFileTypes={ALLOWED_FILE_TYPES}
          helpText={tFileUpload('helperText')}
        />
      </div>
    </>
  );
};
