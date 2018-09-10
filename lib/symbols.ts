/* tslint:disable: variable-name */

////////////////////////////////////////
// FYI: "Symbol.for" gets or creates a symbol into global registry
// Setting it here
////////////////////////////////////////

////////////////////////////////////////
// Permitted - start
////////////////////////////////////////
export const _permittedOwnKeys: unique symbol = Symbol.for('PERMITTED_OWN_KEYS');
export const _permittedOwnTypes: unique symbol = Symbol.for('PERMITTED_OWN_TYPES');
export const _permittedOwnValues : unique symbol= Symbol.for('PERMITTED_OWN_VALUES');

export const _permittedKeys :unique symbol= Symbol.for('PERMITTED_KEYS');
export const _permittedTypes :unique symbol= Symbol.for('PERMITTED_TYPES');
export const _permittedValues :unique symbol= Symbol.for('PERMITTED_VALUES');
////////////////////////////////////////
// Permitted - end
////////////////////////////////////////

////////////////////////////////////////
// RestrictedInterface - start
////////////////////////////////////////
export const _restrictedOwnKeys :unique symbol= Symbol.for('RESTRICTED_OWN_KEYS'); // used for that particular's prototype's own restricted keys.
export const _restrictedOwnTypes :unique symbol= Symbol.for('RESTRICTED_OWN_TYPES');

export const _restrictedKeys :unique symbol= Symbol.for('RESTRICTED_KEYS');
export const _restrictedTypes :unique symbol= Symbol.for('RESTRICTED_TYPES');

export const _restrictedOwnKeysAdd :unique symbol= Symbol.for('RESTRICTED_OWN_KEYS_ADD');
export const _restrictedOwnKeysRemove :unique symbol= Symbol.for('RESTRICTED_OWN_KEYS_REMOVE');
export const _restrictedOwnTypesAdd :unique symbol= Symbol.for('RESTRICTED_OWN_TYPES_ADD');
export const _restrictedOwnTypesRemove :unique symbol= Symbol.for('RESTRICTED_OWN_TYPES_REMOVE');
////////////////////////////////////////
// RestrictedInterface - end
////////////////////////////////////////

////////////////////////////////////////
// Others - start
////////////////////////////////////////
export const _defineType :unique symbol= Symbol.for('DEFINE_TYPE');
export const _inherit :unique symbol= Symbol.for('INHERIT');
export const _inheritType :unique symbol= Symbol.for('INHERIT_DEFINED_TYPE');
export const _clone :unique symbol= Symbol.for('CLONE');
export const _previous :unique symbol= Symbol.for('PREVIOUS');
export const _propId :unique symbol= Symbol.for('PROP_ID');
////////////////////////////////////////
// Others - end
////////////////////////////////////////
