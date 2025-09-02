import { KeyFigure } from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import { type GoApiResponse } from '#utils/restRequest';

import i18n from './i18n.json';

type FieldReportResponse = GoApiResponse<'/api/v2/field-report/{id}/'>;

interface Props {
    value: FieldReportResponse | undefined;
}

function EventNumericDetails(props: Props) {
    const { value } = props;
    const strings = useTranslation(i18n);

    return (
        <>
            <KeyFigure
                label={strings.eventInjuredRCLabel}
                value={value?.num_injured}
                valueType="number"
            />
            <KeyFigure
                label={strings.eventInjuredGovernmentLabel}
                value={value?.gov_num_injured}
                valueType="number"
            />
            <KeyFigure
                label={strings.eventInjuredOtherLabel}
                value={value?.other_num_injured}
                valueType="number"
            />
            <KeyFigure
                label={strings.eventMissingRCLabel}
                value={value?.num_missing}
                valueType="number"
            />
            <KeyFigure
                label={strings.eventMissingGovernmentLabel}
                value={value?.gov_num_missing}
                valueType="number"
            />
            <KeyFigure
                label={strings.eventMissingOtherLabel}
                value={value?.other_num_missing}
                valueType="number"
            />
            <KeyFigure
                label={strings.eventDeadRCLabel}
                value={value?.num_dead}
                valueType="number"
            />
            <KeyFigure
                label={strings.eventDeadGovernmentLabel}
                value={value?.gov_num_dead}
                valueType="number"
            />
            <KeyFigure
                label={strings.eventDeadOtherLabel}
                value={value?.other_num_dead}
                valueType="number"
            />
            <KeyFigure
                label={strings.eventDisplacedRCLabel}
                value={value?.num_displaced}
                valueType="number"
            />
            <KeyFigure
                label={strings.eventDisplacedGovernmentLabel}
                value={value?.gov_num_displaced}
                valueType="number"
            />
            <KeyFigure
                label={strings.eventDisplacedOtherLabel}
                value={value?.other_num_displaced}
                valueType="number"
            />
            <KeyFigure
                label={strings.eventAffectedRCLabel}
                value={value?.num_affected}
                valueType="number"
            />
            <KeyFigure
                label={strings.eventAffectedGovernmentLabel}
                value={value?.gov_num_affected}
                valueType="number"
            />
            <KeyFigure
                label={strings.eventAffectedOtherLabel}
                value={value?.other_num_affected}
                valueType="number"
            />
            <KeyFigure
                label={strings.eventAssistedRCLabel}
                value={value?.num_assisted}
                valueType="number"
            />
            <KeyFigure
                label={strings.eventAssistedGovernmentLabel}
                value={value?.gov_num_assisted}
                valueType="number"
            />
            <KeyFigure
                label={strings.eventLocalStaffLabel}
                value={value?.num_localstaff}
                valueType="number"
            />
            <KeyFigure
                label={strings.eventVolunteersLabel}
                value={value?.num_volunteers}
                valueType="number"
            />
            <KeyFigure
                label={strings.eventERULabel}
                value={value?.num_emergency_response_unit}
                valueType="number"
            />
            <KeyFigure
                label={strings.eventDelegatedLabel}
                value={value?.num_expats_delegates}
                valueType="number"
            />
        </>
    );
}

export default EventNumericDetails;
