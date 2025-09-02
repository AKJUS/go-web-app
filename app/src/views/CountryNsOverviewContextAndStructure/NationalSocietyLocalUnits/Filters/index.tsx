import { SearchLineIcon } from '@ifrc-go/icons';
import {
    Button,
    SelectInput,
    TextInput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    stringNameSelector,
    stringValueSelector,
} from '@ifrc-go/ui/utils';
import { type EntriesAsList } from '@togglecorp/toggle-form';

import useGlobalEnums from '#hooks/domain/useGlobalEnums';
import { type GoApiResponse } from '#utils/restRequest';

import { type ValidationOption } from '../common';

import i18n from './i18n.json';

export interface FilterValue {
    search?: string | undefined;
    type?: number | undefined;
    status?: ValidationOption['key'] | undefined;
}

type LocalUnitOptions = GoApiResponse<'/api/v2/local-units-options/'>;
type LocalUnitType = LocalUnitOptions['type'][number];

function localUnitCodeSelector(localUnit: LocalUnitType) {
    return localUnit.code;
}

function validationKeySelector(option: ValidationOption) {
    return option.key;
}

interface Props {
    value: FilterValue;
    setFieldValue: (...entries: EntriesAsList<FilterValue>) => void;
    options: LocalUnitOptions | undefined;
    resetFilter: () => void;
    filtered: boolean;
}

function Filters(props: Props) {
    const {
        value,
        setFieldValue: onChange,
        options,
        resetFilter,
        filtered,
    } = props;
    const strings = useTranslation(i18n);

    const { local_units_status: validationOptions } = useGlobalEnums();

    return (
        <>
            <SelectInput
                placeholder={strings.localUnitsFilterTypePlaceholder}
                label={strings.localUnitsFilterTypeLabel}
                name="type"
                value={value.type}
                onChange={onChange}
                keySelector={localUnitCodeSelector}
                labelSelector={stringNameSelector}
                options={options?.type}
            />
            <SelectInput
                placeholder={strings.localUnitsFilterValidatedPlaceholder}
                label={strings.localUnitsFilterValidatedLabel}
                name="status"
                value={value.status}
                onChange={onChange}
                keySelector={validationKeySelector}
                labelSelector={stringValueSelector}
                options={validationOptions}
            />
            <TextInput
                name="search"
                label={strings.localUnitsFilterSearchLabel}
                placeholder={strings.localUnitsFilterSearchPlaceholderLabel}
                value={value.search}
                onChange={onChange}
                icons={<SearchLineIcon />}
            />
            <Button
                name={undefined}
                onClick={resetFilter}
                disabled={!filtered}
            >
                {strings.localUnitsFilterClear}
            </Button>
        </>
    );
}

export default Filters;
