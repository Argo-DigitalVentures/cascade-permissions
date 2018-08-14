////////////////////////////////////////
// FYI: "Symbol.for" gets or creates a symbol into global registry
// Setting it here
////////////////////////////////////////

////////////////////////////////////////
// Permitted - start
////////////////////////////////////////
export const _permittedOwnKeys = Symbol.for('PERMITTED_OWN_KEYS');
export const _permittedOwnTypes = Symbol.for('PERMITTED_OWN_TYPES');
export const _permittedOwnValues = Symbol.for('PERMITTED_OWN_VALUES');

export const _permittedKeys = Symbol.for('PERMITTED_KEYS');
export const _permittedTypes = Symbol.for('PERMITTED_TYPES');
export const _permittedValues = Symbol.for('PERMITTED_VALUES');
////////////////////////////////////////
// Permitted - end
////////////////////////////////////////

////////////////////////////////////////
// Restricted - start
////////////////////////////////////////
export const _restrictedOwnKeys = Symbol.for('RESTRICTED_OWN_KEYS'); // used for that particular's prototype's own restricted keys.
export const _restrictedOwnTypes = Symbol.for('RESTRICTED_OWN_TYPES');

export const _restrictedKeys = Symbol.for('RESTRICTED_KEYS');
export const _restrictedTypes = Symbol.for('RESTRICTED_TYPES');

export const _restrictedOwnKeysAdd = Symbol.for('RESTRICTED_OWN_KEYS_ADD');
export const _restrictedOwnKeysRemove = Symbol.for(
  'RESTRICTED_OWN_KEYS_REMOVE'
);
export const _restrictedOwnTypesAdd = Symbol.for('RESTRICTED_OWN_TYPES_ADD');
export const _restrictedOwnTypesRemove = Symbol.for(
  'RESTRICTED_OWN_TYPES_REMOVE'
);
////////////////////////////////////////
// Restricted - end
////////////////////////////////////////

////////////////////////////////////////
// Others - start
////////////////////////////////////////
export const _defineType = Symbol.for('DEFINE_TYPE');
export const _inherit = Symbol.for('INHERIT');
export const _inheritType = Symbol.for('INHERIT_DEFINED_TYPE');
export const _clone = Symbol.for('CLONE');
export const _previous = Symbol.for('PREVIOUS');
export const _propId = Symbol.for('PROP_ID');
////////////////////////////////////////
// Others - end
////////////////////////////////////////

export const nativeSymbols = [
  'inspect',
  'util.inspect.custom',
  Symbol.iterator,
  Symbol.toStringTag,
];
