import { type GoApiResponse } from '#utils/restRequest';

type GlobalEnumsResponse = GoApiResponse<'/api/v2/global-enums/'>;
export type ValidationOption = NonNullable<GlobalEnumsResponse['local_units_status']>[number];
export type ValidationStatusKey = ValidationOption['key'];
type RequestType = 'authenticated' | 'public';

export type ManageResponse = Record<number, {
    enabled: boolean | undefined,
    externallyManagedId: number,
}> | undefined;

export const VALIDATED = 1 satisfies ValidationStatusKey;
export const UNVALIDATED = 2 satisfies ValidationStatusKey;
export const PENDING_VALIDATION = 3 satisfies ValidationStatusKey;

export const AUTHENTICATED = 'authenticated' satisfies RequestType;
export const PUBLIC = 'public' satisfies RequestType;
