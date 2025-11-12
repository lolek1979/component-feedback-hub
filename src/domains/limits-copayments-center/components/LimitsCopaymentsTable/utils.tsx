export const handleColumnVisibilityChange = (
  setVisibleColumns: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>,
  excludedKeys: string[],
  objectKeys: Record<string, string>[],
) => {
  if (!objectKeys || objectKeys.length === 0) return;

  const excluded = new Set(excludedKeys);

  setVisibleColumns((prev) => {
    const updates = objectKeys.reduce<Record<string, boolean>>((acc, { value }) => {
      acc[value] = !excluded.has(value);

      return acc;
    }, {});

    return { ...prev, ...updates };
  });
};
