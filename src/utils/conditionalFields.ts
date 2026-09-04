export function getActiveCustomFields(
  fields: any[],
  conditions: { enabled: boolean; referenceFieldId: string; rules: Array<{ targetFieldId: string; threshold: number }> } | undefined,
  characterData: any
): any[] {
  if (!fields || fields.length === 0) return [];

  // First, filter out disabled fields and sort them
  const validFields = fields
    .filter((f) => f.enabled !== false)
    .sort((a, b) => {
      const orderA = typeof a.order === "number" ? a.order : 999;
      const orderB = typeof b.order === "number" ? b.order : 999;
      return orderA - orderB;
    });

  if (!conditions || !conditions.enabled) {
    return validFields;
  }

  // Get the reference field value from character data
  // The value might be in `customData` or at the root of `characterData`
  let refValueRaw = characterData?.customData?.[conditions.referenceFieldId] 
                    ?? characterData?.[conditions.referenceFieldId];
  
  // Try to parse it as a number
  let refValue = 0;
  if (typeof refValueRaw === 'number') {
    refValue = refValueRaw;
  } else if (typeof refValueRaw === 'string') {
    // Extract the first number found in the string, or 0
    const match = refValueRaw.match(/-?\d+(\.\d+)?/);
    if (match) {
      refValue = parseFloat(match[0]);
    }
  }

  // Determine which target fields should be active
  const activeTargetFieldIds = new Set<string>();
  
  for (const rule of conditions.rules) {
    if (refValue >= rule.threshold) {
      activeTargetFieldIds.add(rule.targetFieldId);
    }
  }

  // Filter the fields
  return validFields.filter(f => {
    // The reference field is always active
    if (f.id === conditions.referenceFieldId) return true;
    
    // Check if this field is a target of any rule
    const isTargetOfRule = conditions.rules.some(r => r.targetFieldId === f.id);
    
    // If it's a target of a rule, it must be in activeTargetFieldIds to be shown
    if (isTargetOfRule) {
      return activeTargetFieldIds.has(f.id);
    }
    
    // If it's not a target of any rule, it's always active
    return true;
  });
}
