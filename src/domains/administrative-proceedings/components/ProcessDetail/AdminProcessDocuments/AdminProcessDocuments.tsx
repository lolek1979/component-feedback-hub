'use client';

import React, { useMemo, useState } from 'react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';

import IAttachFile from '@/core/assets/icons/attach_file.svg';
import { Button, Divider, Text } from '@/design-system/atoms';
import {
  useAdminProcessDocuments,
  useAdminProcessDocumentTypes,
} from '@/domains/administrative-proceedings/api';
import {
  getAdminProcessDocumentDownload,
  putAdminProcessDocument,
} from '@/domains/administrative-proceedings/api/services';
import { AdminProcessDocument } from '@/domains/administrative-proceedings/api/services/getAdminProcessDocuments';

import AdminProcessDocumentsSkeleton from '../AdminProcessDocumentsSkeleton/AdminProcessDocumentsSkeleton';
import styles from './AdminProcessDocuments.module.css';

interface AdminProcessDocumentsProps {
  adminProcessId: string;
}

const DroppableDocumentList = ({
  docType,
  documents,
  onDownload,
}: {
  docType: { code: string; name: string };
  documents: AdminProcessDocument[];
  onDownload: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, documentId: string) => void;
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: docType.code,
  });

  return (
    <ul
      ref={setNodeRef}
      className={clsx(styles.documentsList, { [styles.documentsListOver]: isOver })}
    >
      {documents.map((document) => (
        <DraggableDocumentItem
          key={document.id}
          document={document}
          typeCode={docType.code}
          onDownload={onDownload}
        />
      ))}
    </ul>
  );
};

const DraggableDocumentItem = ({
  document,
  typeCode,
  onDownload,
}: {
  document: AdminProcessDocument;
  typeCode: string;
  onDownload: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, documentId: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `${document.id}:${typeCode}`,
    data: {
      documentId: document.id,
      typeCode: typeCode,
      document: document,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
      }
    : {
        cursor: 'grab',
      };

  return (
    <li ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Button
        id={`admin-process-document-${document.id}`}
        variant="secondary"
        icon={<IAttachFile id={`icon-process-document-${document.id}`} />}
        className={styles.documentButton}
        onClick={(e) => onDownload(e, document.id)}
      >
        {document.fileName}
      </Button>
    </li>
  );
};

const AdminProcessDocuments = (props: AdminProcessDocumentsProps) => {
  const { adminProcessId } = props;
  const documentTypes = useAdminProcessDocumentTypes();
  const processDocuments = useAdminProcessDocuments(adminProcessId);

  // Organize documents by type, memoized for performance
  const organizedDocuments = useMemo(() => {
    if (!documentTypes.data) return { OTHR: [] };
    const typeMap = documentTypes.data.reduce(
      (acc: { [key: string]: AdminProcessDocument[] }, typeDoc) => {
        if (typeDoc.code) acc[typeDoc.code] = [];

        return acc;
      },
      { OTHR: [] as AdminProcessDocument[] },
    );
    processDocuments.data?.forEach((doc) => {
      const type = doc.documentType?.code || 'OTHR';
      if (!typeMap[type]) typeMap[type] = [];
      typeMap[type].push(doc);
    });

    return typeMap;
  }, [documentTypes.data, processDocuments.data]);

  // State for docs by type, initialized from organizedDocuments
  const [docsByType, setDocsByType] =
    useState<Record<string, AdminProcessDocument[]>>(organizedDocuments);

  // Keep docsByType in sync if organizedDocuments changes (e.g. after refetch)
  React.useEffect(() => {
    setDocsByType(organizedDocuments);
  }, [organizedDocuments]);

  const { mutate: saveDocumentChange } = useMutation({
    mutationFn: putAdminProcessDocument,
    onError: (error) => {
      console.error('Failed to save document:', error);
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const handleDownloadDocument = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    documentId: string,
  ) => {
    e.preventDefault();

    try {
      const documentData = await getAdminProcessDocumentDownload(documentId);
      const blob = new Blob([documentData], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);

      // Find the document to get its file name (faster with find)
      let fileName = '';
      for (const docs of Object.values(docsByType)) {
        const foundDoc = docs.find((doc) => doc.id === documentId);
        if (foundDoc) {
          fileName = foundDoc.fileName;
          break;
        }
      }

      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = fileName || `document-${documentId}`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const [activeDocId, activeTypeCode] = active.id.toString().split(':');
    const overTypeCode = over.id.toString();

    if (activeTypeCode !== overTypeCode) {
      const documentToMove = docsByType[activeTypeCode]?.find((doc) => doc.id === activeDocId);

      if (documentToMove) {
        const updatedDocsByType = { ...docsByType };

        updatedDocsByType[activeTypeCode] = updatedDocsByType[activeTypeCode].filter(
          (doc) => doc.id !== activeDocId,
        );

        updatedDocsByType[overTypeCode] = [
          ...(updatedDocsByType[overTypeCode] || []),
          documentToMove,
        ];

        setDocsByType(updatedDocsByType);

        saveDocumentChange({
          id: activeDocId,
          documentTypeCode: overTypeCode,
        });
      }
    }
  };

  if (processDocuments.isLoading || documentTypes.isLoading) {
    return <AdminProcessDocumentsSkeleton />;
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div>
        {documentTypes.data?.map((docType, index) => {
          const documents = docsByType[docType.code || ''] || [];

          return (
            <React.Fragment key={docType.code}>
              {index > 0 && <Divider variant="dotted" />}

              <div className={styles.documentsGroup}>
                <Text variant="subtitle" className={styles.groupName}>
                  {docType.name}
                </Text>
                <DroppableDocumentList
                  docType={{ code: String(docType.code), name: String(docType.name) }}
                  documents={documents}
                  onDownload={handleDownloadDocument}
                />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </DndContext>
  );
};

export default AdminProcessDocuments;
