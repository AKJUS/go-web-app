import { KeyFigure } from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import { type GoApiResponse } from '#utils/restRequest';

import i18n from './i18n.json';

type FieldReportResponse = GoApiResponse<'/api/v2/field-report/{id}/'>;

interface Props {
    value: FieldReportResponse | undefined;
}

function EpidemicNumericDetails(props: Props) {
    const { value } = props;
    const strings = useTranslation(i18n);

    /* epi_deaths_since_last_fr */

    // FIXME: Show conditional labels

    return (
        <>
            <KeyFigure
                label={strings.epidemicCumulativeCasesLabel}
                value={value?.epi_cases}
                valueType="number"
            />
            <KeyFigure
                label={strings.epidemicSuspectedCasesLabel}
                value={value?.epi_suspected_cases}
                valueType="number"
            />
            <KeyFigure
                label={strings.epidemicProbableCasesLabel}
                value={value?.epi_probable_cases}
                valueType="number"
            />
            <KeyFigure
                label={strings.epidemicConfirmedCasesLabel}
                value={value?.epi_confirmed_cases}
                valueType="number"
            />
            <KeyFigure
                label={strings.epidemicDeadLabel}
                value={value?.epi_num_dead}
                valueType="number"
            />
            <KeyFigure
                label={strings.epidemicAssistedRCLabel}
                value={value?.num_assisted}
                valueType="number"
            />
            <KeyFigure
                label={strings.epidemicAssistedGovernmentLabel}
                value={value?.gov_num_assisted}
                valueType="number"
            />
            <KeyFigure
                label={strings.epidemicLocalStaffLabel}
                value={value?.num_localstaff}
                valueType="number"
            />
            <KeyFigure
                label={strings.epidemicVolunteersLabel}
                value={value?.num_volunteers}
                valueType="number"
            />
            <KeyFigure
                label={strings.epidemicDelegatesLabel}
                value={value?.num_expats_delegates}
                valueType="number"
            />
        </>
    );
}

export default EpidemicNumericDetails;
