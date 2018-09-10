/* tslint:disable: variable-name */

////////////////////////////////////////
// FYI: "Symbol.for" gets or creates a symbol into global registry
// Setting it here
////////////////////////////////////////

////////////////////////////////////////
// Permitted - start
////////////////////////////////////////
export const _permittedOwnKeys: any = Symbol.for('PERMITTED_OWN_KEYS');
export const _permittedOwnTypes: any = Symbol.for('PERMITTED_OWN_TYPES');
export const _permittedOwnValues: any = Symbol.for('PERMITTED_OWN_VALUES');

export const _permittedKeys: any = Symbol.for('PERMITTED_KEYS');
export const _permittedTypes: any = Symbol.for('PERMITTED_TYPES');
export const _permittedValues: any = Symbol.for('PERMITTED_VALUES');
////////////////////////////////////////
// Permitted - end
////////////////////////////////////////

////////////////////////////////////////
// RestrictedInterface - start
////////////////////////////////////////
export const _restrictedOwnKeys: any = Symbol.for('RESTRICTED_OWN_KEYS'); // used for that particular's prototype's own restricted keys.
export const _restrictedOwnTypes: any = Symbol.for('RESTRICTED_OWN_TYPES');

export const _restrictedKeys: any = Symbol.for('RESTRICTED_KEYS');
export const _restrictedTypes: any = Symbol.for('RESTRICTED_TYPES');

export const _restrictedOwnKeysAdd: any = Symbol.for('RESTRICTED_OWN_KEYS_ADD');
export const _restrictedOwnKeysRemove: any = Symbol.for('RESTRICTED_OWN_KEYS_REMOVE');
export const _restrictedOwnTypesAdd: any = Symbol.for('RESTRICTED_OWN_TYPES_ADD');
export const _restrictedOwnTypesRemove: any = Symbol.for('RESTRICTED_OWN_TYPES_REMOVE');
////////////////////////////////////////
// RestrictedInterface - end
////////////////////////////////////////

////////////////////////////////////////
// Others - start
////////////////////////////////////////
export const _defineType: any = Symbol.for('DEFINE_TYPE');
export const _inherit: any = Symbol.for('INHERIT');
export const _inheritType: any = Symbol.for('INHERIT_DEFINED_TYPE');
export const _clone: any = Symbol.for('CLONE');
export const _previous: any = Symbol.for('PREVIOUS');
export const _propId: any = Symbol.for('PROP_ID');
////////////////////////////////////////
// Others - end
////////////////////////////////////////
