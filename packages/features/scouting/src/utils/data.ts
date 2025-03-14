export function fuseData(
  fields: any[],
  submitted: { [key: string]: any } = {},
): { [key: string]: any } {
  const result: { [key: string]: any } = {};

  fields.forEach((field, index) => {
    if (field.type === 'header') return;

    if (field.type === 'matrix') {
      result[field.label] = JSON.stringify(
        field.matrixRows.map((row: any) => {
          const key = `field_${index}_${row.id}`;
          const value = key in submitted ? submitted[key] : row.value;
          return {
            id: row.id,
            label: row.label,
            value,
          };
        }),
      );
    } else if (field.type === 'boolean') {
      const key = `field_${index}`;
      if (!submitted[key] || submitted[key] === 'false') {
        result[field.label] = false;
      }

      if (submitted[key] === 'true' || submitted[key] === true) {
        result[field.label] = true;
      }
    } else {
      const key = `field_${index}`;
      result[field.label] = key in submitted ? submitted[key] : null;
    }
  });

  return result;
}
