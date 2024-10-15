// Helper function to transform the entities array into the required format
export function transformDocumentAIResponseArray(extractedTexts) {
  let id = 0;
  return extractedTexts.reduce((acc, textObj) => {
    const entities = textObj.entities || [];

    // Object to hold the current sheet number and title
    let currentSheet = {};
    id += 1;
    if (entities.length === 0) {
      acc.push({
        sheetNumber: '',
        sheetTitle: '',
        id,
      });
    } else {
      entities.forEach((entity) => {
        if (entity.type === 'sheetNumber') {
          currentSheet.sheetNumber = entity.mentionText;
          currentSheet.id = id; // Ensure id is associated with this entity
        }

        if (entity.type === 'sheetTitle') {
          currentSheet.sheetTitle = entity.mentionText;
          currentSheet.id = id; // Ensure id is associated with this entity
        }

        // If both sheetNumber and sheetTitle are present, push the object
        if (currentSheet.sheetNumber && currentSheet.sheetTitle) {
          acc.push({ ...currentSheet });
          currentSheet = {}; // Reset the current sheet object for the next one
        }
      });

      // In case there is a leftover entity with either sheetNumber or sheetTitle, push it
      if (currentSheet.sheetNumber || currentSheet.sheetTitle) {
        acc.push({ ...currentSheet });
      }
    }

    return acc;
  }, []);
}
