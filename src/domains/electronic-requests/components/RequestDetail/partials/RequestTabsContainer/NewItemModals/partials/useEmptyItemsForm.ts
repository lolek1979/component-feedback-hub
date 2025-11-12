import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import * as z from 'zod';

import { useRequestById, useRequestItem } from '@/domains/electronic-requests/api/query';

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  id?: string;
}

export const amountTypes: Record<string, string> = {
  KS: 'Ks',
  liter: 'L',
  kilogram: 'Kg',
  gram: 'g',
  meter: 'm',
  czechCrown: 'Kč',
};

const createFormSchema = (t: (key: string) => string) => {
  return z.object({
    title: z.string().min(1, { message: t('form.titleRequired') }),
    description: z.string().optional(),
    numberInSAP: z.string().optional(),
    supplierNumber: z.string().optional(),
    measureUnit: z.string(),
    quantity: z.number().min(1, { message: t('form.amountRequired') }),
    justification: z.string().optional().nullable(),
    unitPrice: z.number().min(1, { message: t('form.priceRequired') }),
    contract: z.string().optional(),
    categoryId: z.string(),
    expectedDeliveryDate: z.string(),
    hyperlink: z.string().optional(),
    bindingToContract: z.string().optional(),
    attachments: z.array(z.any()).optional(),
  });
};

export type FormData = z.infer<ReturnType<typeof createFormSchema>>;

export const useEmptyItemsForm = (
  setIsModalVisible: (visible: boolean, success?: boolean) => void,
  requestId: string | null,
  itemId?: string,
) => {
  const t = useTranslations('requests.requestDetail.tabs.items.itemsActions');
  const tFieldValidations = useTranslations(
    'requests.requestDetail.tabs.items.emptyItemsModal.validationErrors',
  );
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formSchema = createFormSchema(tFieldValidations);

  const { data: requestData, isLoading: isLoadingRequest } = useRequestById({
    id: requestId || '',
    enabled: !!requestId && !!itemId,
  });

  const requestItemMutation = useRequestItem({
    onSuccess: () => {
      setIsModalVisible(false, true);
      setIsSubmitting(false);
    },
    onError: () => {
      setIsSubmitting(false);
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      numberInSAP: '',
      supplierNumber: '',
      measureUnit: 'KS',
      quantity: 0,
      justification: null,
      unitPrice: 0,
      contract: '',
      categoryId: '',
      expectedDeliveryDate: new Date().toISOString().split('T')[0],
      hyperlink: '',
      bindingToContract: '',
      attachments: [],
    },
  });
  useEffect(() => {
    if (requestData && itemId) {
      const currentItem = requestData.items?.find((item) => item.id === itemId);

      if (currentItem) {
        const itemData = currentItem.manualItem || currentItem.catalogueItem;

        if (itemData) {
          const formValues: Partial<FormData> = {
            title: currentItem.description,
            description: itemData.description,
            numberInSAP: itemData.sapNumber,
            supplierNumber: itemData.supplierArticleNumber,
            measureUnit:
              Object.keys(amountTypes).find((key) => amountTypes[key] === itemData.unitOfMeasure) ||
              'KS',
            quantity: currentItem.quantity,
            justification: currentItem.justification,
            unitPrice: itemData.unitPrice,
            contract: itemData.contract,
            hyperlink: itemData.externalUrl,
            attachments:
              currentItem.attachments?.map((att) => ({
                id: att.id || crypto.randomUUID(),
                name: att.fileName || 'Unknown file',
              })) || [],
          };

          Object.entries(formValues).forEach(([key, value]) => {
            if (value !== undefined) {
              setValue(key as keyof FormData, value);
            }
          });

          if (currentItem.attachments) {
            const files: UploadedFile[] = currentItem.attachments.map((att) => ({
              id: att.id,
              name: att.fileName || 'Unknown file',
              size: 0,
              type: '',
            }));
            setUploadedFiles(files);
          }
        }
      }
    }
  }, [requestData, itemId, setValue, setUploadedFiles]);
  const getCurrentUnit = () => amountTypes[watch('measureUnit')] || 'KS';

  const calculateTotalPrice = (price: string | number, amount: string | number): string => {
    const priceNum = typeof price === 'number' ? price : parseFloat(price || '0');
    const amountNum = typeof amount === 'number' ? amount : parseFloat(amount || '0');

    if (isNaN(priceNum) || isNaN(amountNum)) return '0 Kč';

    return `${(priceNum * amountNum).toLocaleString('cs-CZ', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} Kč`;
  };

  const handleDateChange = (fieldName: keyof FormData, dateValue: string) => {
    setValue(fieldName, dateValue);
  };

  const formatDeliveryDate = (dateString?: string): string => {
    if (!dateString) return new Date().toISOString().split('T')[0];

    return dateString.includes('T') ? dateString.split('T')[0] : dateString;
  };

  const onSubmit = async (data: FormData) => {
    if (!requestId) return;

    try {
      setIsSubmitting(true);

      const expectedDeliveryDate = formatDeliveryDate(data.expectedDeliveryDate);

      let attachmentIds: string[] = [];
      const isString = (id: unknown): id is string => typeof id === 'string';

      if (data.attachments && Array.isArray(data.attachments)) {
        attachmentIds = data.attachments
          .map((attachment) => {
            return attachment.id;
          })
          .filter(isString);
      }

      if (attachmentIds.length === 0 && uploadedFiles.length > 0) {
        attachmentIds = uploadedFiles.map((file) => file.id).filter(isString);
      }

      const requestItemData = {
        description: data.title ?? '',
        quantity: Number(data.quantity),
        justification: data.justification,
        expectedDeliveryDate,
        attachments: attachmentIds,
        manualItem: {
          description: data.description ?? '',
          categoryId: data.categoryId,
          supplierArticleNumber: data.supplierNumber ?? '',
          unitOfMeasure: data.measureUnit ?? '',
          unitPrice: Number(data.unitPrice ?? 0),
          contract: data.contract ?? '',
          externalUrl: data.hyperlink ?? '',
        },
      };

      await requestItemMutation.mutateAsync({
        requestId,
        items: [requestItemData],
      });

      setIsModalVisible(false);
      toast.success(t('addItemSuccess'), {
        id: 'toast-create-item-success',
      });
    } catch (error) {
      console.error('Error creating request item:', error);
      toast.error(t('addItemError'), {
        id: 'toast-create-item-error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    control,
    handleSubmit,
    errors,
    watch,
    setValue,
    uploadedFiles,
    setUploadedFiles,
    handleDateChange,
    calculateTotalPrice,
    getCurrentUnit,
    amountTypes,
    onSubmit,
    isSubmitting,
    isLoading: requestItemMutation.isPending || isLoadingRequest,
  };
};
