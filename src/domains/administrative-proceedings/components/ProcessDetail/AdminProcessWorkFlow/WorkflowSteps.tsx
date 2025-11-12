import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation } from '@tanstack/react-query';
import { parseAsFloat, useQueryState } from 'nuqs';

import {
  AdminProcessActionTypeCode,
  adminProcessActionTypeCodes,
  AdminProcessDecisionTypeCode,
  adminProcessDecisionTypeCodes,
} from '@/core/lib/definitions';
import { Checkbox, Text, Textarea } from '@/design-system/atoms';
import {
  postAdminProcessAction,
  postAdminProcessDecision,
  putAdminProcess,
} from '@/domains/administrative-proceedings/api/services';
import { DecisionCreateDto } from '@/domains/administrative-proceedings/api/services/postAdminProcessDecision';

import { FormBlock } from '../../AdminProcessLayout/AdminProcessLayout';
import { AdminProcessPenaltyCalculationModal } from '../../AdminProcessPenaltyCalculationModal';
import AdminProcessDocuments from '../AdminProcessDocuments/AdminProcessDocuments';
import styles from '../ProcessDetail.module.css';
import CalculatedFinalPenalty from './CalculatedFinalPenalty';
import SelectDecisionResult from './SelectDecisionResult';
import WaivedAmountInput from './WaivedAmountInput';

export interface FormContextType {
  note: string | null;
  setNote: (value: string) => void;
  saveCurrentForm: (adminProcessId: string, currentStepId: string) => Promise<void>;
  isSaving: boolean;
  highAttention: boolean;
  setHighAttention: (value: boolean) => void;
}

export const FormsContext = createContext<FormContextType>({
  note: null,
  setNote: () => {},
  saveCurrentForm: async () => {},
  isSaving: false,
  highAttention: false,
  setHighAttention: () => {},
});

function calculateDecision(originalPenalty: number, waived: number) {
  let decisionType: AdminProcessDecisionTypeCode = adminProcessDecisionTypeCodes.deny;
  let finalPenalty = originalPenalty - waived;

  if (finalPenalty < 0) {
    finalPenalty = 0;
    decisionType = adminProcessDecisionTypeCodes.full;
  } else if (finalPenalty < originalPenalty && finalPenalty > 0) {
    decisionType = adminProcessDecisionTypeCodes.part;
  } else if (finalPenalty >= originalPenalty) {
    finalPenalty = originalPenalty;
  }

  return { decisionType, finalPenalty };
}

export const useFormsContext = () => useContext(FormsContext);

export const FormsProvider = ({
  children,
  adminProcessId,
}: {
  children: React.ReactNode;
  adminProcessId: string;
}) => {
  const [activeStepId, setActiveStepId] = useState<string>('admin-process-request-step');
  const [currentActionTypeCode, setCurrentActionTypeCode] = useState<AdminProcessActionTypeCode>(
    adminProcessActionTypeCodes.reqProc,
  );
  const [note, setNoteState] = useState<string | null>(null);
  const [highAttention, setHighAttentionState] = useState<boolean>(false);
  const [waivedAmount] = useQueryState('waivedAmount', parseAsFloat.withDefault(0));

  const { mutate: actionUpdate } = useMutation({
    mutationFn: postAdminProcessAction,
  });
  const { mutate: createDecision } = useMutation({
    mutationFn: postAdminProcessDecision,
  });
  const { mutateAsync, isPending: isSaving } = useMutation({
    mutationFn: putAdminProcess,
    onSuccess: (data) => {
      setNoteState(data.note ?? '');
      setHighAttentionState(!!data.highAttention);

      actionUpdate({
        id: adminProcessId,
        actionTypeCode: currentActionTypeCode,
      });

      if (currentActionTypeCode === adminProcessActionTypeCodes.decDraft) {
        const { decisionType, finalPenalty } = calculateDecision(originalPenaltyDebt, waivedAmount);

        const dto: DecisionCreateDto = {
          adminProcessId,
          reasoning: data.note ?? '',
          dateDecision: new Date().toISOString(),
          amount: finalPenalty,
          decisionTypeCode: decisionType,
        };

        createDecision(dto);
      }
    },
    onError: (error) => {
      console.error('Failed to save form:', error);
    },
  });

  const setNote = useCallback((value: string) => {
    setNoteState(value);
  }, []);

  const setHighAttention = useCallback((value: boolean) => {
    setHighAttentionState(value);
  }, []);

  const saveCurrentForm = useCallback(
    async (adminProcessId: string, currentStepId: string) => {
      setActiveStepId(currentStepId);
      if (!isSaving) {
        await mutateAsync({
          id: adminProcessId,
          note: note ?? '',
          highAttention: highAttention,
        });
      }
    },
    [note, highAttention, isSaving, mutateAsync],
  );

  useEffect(() => {
    switch (activeStepId) {
      default:
        setCurrentActionTypeCode(adminProcessActionTypeCodes.caseInit);
        break;
      case 'admin-process-request-step':
        setCurrentActionTypeCode(adminProcessActionTypeCodes.reqProc);
        break;
      case 'admin-process-case-preparation':
        setCurrentActionTypeCode(adminProcessActionTypeCodes.reqValid);
        break;
      case 'admin-process-draft-control':
      case 'admin-process-commission-recomment':
      case 'admin-process-recommendation-decision':
      case 'admin-process-decision-prepare':
      case 'admin-process-force-entry':
      case 'admin-process-decision-settlement':
        setCurrentActionTypeCode(adminProcessActionTypeCodes.decDraft);
        break;
    }
  }, [activeStepId]);

  return (
    <FormsContext.Provider
      value={{
        note,
        setNote,
        saveCurrentForm,
        isSaving,
        highAttention,
        setHighAttention,
      }}
    >
      {children}
    </FormsContext.Provider>
  );
};

const NoteTextArea = ({ id, t }: { id: string; t: (key: string) => string }) => {
  const { note, setNote, isSaving } = useFormsContext();

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
  };

  return (
    <div className={styles.casePreparationNote}>
      <Textarea
        id={id}
        className={styles.noteTextArea}
        placeholder={t('casePreparation.note.fields.placeholder')}
        value={note || ''}
        onChange={handleNoteChange}
        disabled={isSaving}
      />

      <Text variant="caption">{t('casePreparation.note.fields.example')}</Text>
      {isSaving && <Text variant="caption">Saving note...</Text>}
    </div>
  );
};

const PriorityCheckbox = () => {
  const { highAttention, setHighAttention } = useFormsContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setHighAttention(e.target.checked);
  };

  return (
    <Checkbox
      id={`priority-checkbox`}
      checked={!!highAttention}
      onChange={handleChange}
      label="Higher Attention"
    />
  );
};

export interface WorkflowStep {
  id: string;
  title: string;
  group: string;
  formBlocks: FormBlock[];
  buttonText: string;
}

const originalPenaltyDebt = 25000; // Original penalty debt for the mock data
const formattedOriginalPenaltyDebt = originalPenaltyDebt.toLocaleString('cs-CZ', {
  style: 'currency',
  currency: 'CZK',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const useWorkflowSteps = (adminProcessId: string = ''): WorkflowStep[] => {
  const t = useTranslations('administrativeProceedings.workflowSteps');

  const requestStep: FormBlock[] = [
    {
      title: t('requestStep.basicInfo.title'),
      items: [
        { label: t('requestStep.basicInfo.fields.submissionDate'), value: '- ' },
        { label: t('requestStep.basicInfo.fields.timeToProcess'), value: '-' },
        { label: t('requestStep.basicInfo.fields.requestReason'), value: '-' },
      ],
    },
    {
      title: t('requestStep.contacts.title'),
      items: [
        { label: t('requestStep.contacts.fields.name'), value: '- ' },
        { label: t('requestStep.contacts.fields.address'), value: '-' },
        { label: t('requestStep.contacts.fields.email'), value: '-' },
        { label: t('requestStep.contacts.fields.phone'), value: '-' },
        { label: t('requestStep.contacts.fields.dataBox'), value: '-' },
        { label: t('requestStep.contacts.fields.bankAccount'), value: '-' },
      ],
    },
    {
      title: t('requestStep.attachments.title'),
      component: <AdminProcessDocuments adminProcessId={adminProcessId} />,
    },
  ];

  const casePreparationStep: FormBlock[] = [
    {
      title: t('casePreparation.payerId.title'),
      items: [
        { label: t('casePreparation.payerId.fields.name'), value: 'Jan' },
        { label: t('casePreparation.payerId.fields.surname'), value: 'Novák' },
        { label: t('casePreparation.payerId.fields.familyId'), value: '1234567890' },
        { label: t('casePreparation.payerId.fields.ICO'), value: '-' },
        { label: t('casePreparation.payerId.fields.DIC'), value: '-' },
      ],
    },
    {
      title: t('casePreparation.contactDetails.title'),
      items: [
        {
          label: t('casePreparation.contactDetails.fields.address'),
          value: 'Vysoké pece 79, Milán, 004 42',
        },
        { label: t('casePreparation.contactDetails.fields.email'), value: 'jan.novak@email.cz' },
        { label: t('casePreparation.contactDetails.fields.phone'), value: '+420 721 234 567' },
        {
          label: t('casePreparation.contactDetails.fields.dataBox'),
          value: 'fd4efe3 (OSVČ, primární)',
        },
      ],
    },
    {
      title: t('casePreparation.penaltyAmount.title'),
      items: [
        { label: t('casePreparation.penaltyAmount.fields.insuranceDebt'), value: '0 Kč' },
        {
          label: t('casePreparation.penaltyAmount.fields.penaltyDebt'),
          value: String(formattedOriginalPenaltyDebt),
        },
      ],
    },
    {
      title: t('casePreparation.formalRequirements.title'),
      component: <AdminProcessDocuments adminProcessId={adminProcessId} />,
    },
    {
      title: t('casePreparation.note.title'),
      items: [
        {
          label: <NoteTextArea id="case-preparation-note-text-area" t={t} />,
        },
        {
          label: t('casePreparation.note.fields.attention'),
          value: <PriorityCheckbox />,
        },
      ],
    },
  ];

  const draftControlStep: FormBlock[] = [
    {
      title: t('draftControl.formalRequirements.title'),
      component: <AdminProcessDocuments adminProcessId={adminProcessId} />,
    },
    {
      title: t('draftControl.caseDocuments.title'),
      items: [
        { label: t('draftControl.caseDocuments.fields.insuranceDebt'), value: '0 Kč' },
        {
          label: t('draftControl.caseDocuments.fields.penaltyDebt'),
          value: String(formattedOriginalPenaltyDebt),
        },
      ],
    },
    {
      title: t('draftControl.draftDecision.title'),
      items: [
        {
          label: t('draftControl.draftDecision.fields.discussionResult'),
          value: <SelectDecisionResult penaltyDebt={originalPenaltyDebt} />,
        },
        {
          label: t('draftControl.draftDecision.fields.penaltyAmount'),
          value: String(formattedOriginalPenaltyDebt),
        },
        {
          label: t('draftControl.draftDecision.fields.penaltyFeeWaived'),
          value: <WaivedAmountInput />,
        },
        {
          label: t('draftControl.draftDecision.fields.finalPenalty'),
          value: <CalculatedFinalPenalty originalPenalty={originalPenaltyDebt} />,
        },
        {
          value: (
            <>
              <AdminProcessPenaltyCalculationModal
                insuranceDebt={0}
                penaltyDebt={originalPenaltyDebt}
              />
            </>
          ),
        },
      ],
    },
    {
      title: t('draftControl.note.title'),
      items: [
        {
          label: <NoteTextArea id="draft-control-note-text-area" t={t} />,
        },
        {
          label: t('casePreparation.note.fields.attention'),
          value: <PriorityCheckbox />,
        },
      ],
    },
  ];

  return [
    {
      id: 'admin-process-request-step',
      title: t('requestStep.title'),
      group: t('requestStep.group'),
      formBlocks: requestStep,
      buttonText: t('requestStep.button'),
    },
    {
      id: 'admin-process-case-preparation',
      title: t('casePreparation.title'),
      group: t('casePreparation.group'),
      formBlocks: casePreparationStep,
      buttonText: t('casePreparation.button'),
    },
    {
      id: 'admin-process-draft-control',
      title: t('draftControl.title'),
      group: t('draftControl.group'),
      formBlocks: draftControlStep,
      buttonText: t('draftControl.button'),
    },
    //TODO: Change the formBlocks and button/buttons texts
    //  for the following objects when implemented
    {
      id: 'admin-process-commission-recomment',
      title: t('commissionRecommend.title'),
      group: t('commissionRecommend.group'),
      formBlocks: draftControlStep,
      buttonText: t('draftControl.button'),
    },
    {
      id: 'admin-process-recommendation-decision',
      title: t('recommendationDecision.title'),
      group: t('recommendationDecision.group'),
      formBlocks: draftControlStep,
      buttonText: t('draftControl.button'),
    },
    {
      id: 'admin-process-decision-prepare',
      title: t('decisionPrepare.title'),
      group: t('decisionPrepare.group'),
      formBlocks: draftControlStep,
      buttonText: t('draftControl.button'),
    },
    {
      id: 'admin-process-force-entry',
      title: t('forceEntry.title'),
      group: t('forceEntry.group'),
      formBlocks: draftControlStep,
      buttonText: t('draftControl.button'),
    },
    {
      id: 'admin-process-decision-settlement',
      title: t('decisionSettlement.title'),
      group: t('decisionSettlement.group'),
      formBlocks: draftControlStep,
      buttonText: t('draftControl.button'),
    },
  ];
};
