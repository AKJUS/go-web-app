import {
    AppealsIcon,
    DrefIcon,
    FundingCoverageIcon,
    FundingIcon,
    TargetedPopulationIcon,
} from '@ifrc-go/icons';
import {
    InfoPopup,
    KeyFigureView,
    ListView,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { getPercentage } from '@ifrc-go/ui/utils';

import i18n from './i18n.json';

interface Props {
    data: {
        active_drefs: number | null;
        active_appeals: number | null;
        target_population: number | null;
        amount_requested: number | null;
        amount_requested_dref_included: number | null;
        amount_funded: number | null;
        amount_funded_dref_included: number | null;
    }
}

function CountryKeyFigures(props: Props) {
    const { data } = props;
    const strings = useTranslation(i18n);

    return (
        <ListView
            layout="grid"
            numPreferredGridColumns={5}
        >
            <KeyFigureView
                icon={<DrefIcon />}
                value={data.active_drefs}
                valueType="number"
                info={(
                    <InfoPopup
                        title={strings.countryOngoingActivitiesKeyFiguresDrefTitle}
                        description={strings.countryOngoingActivitiesKeyFiguresDref}
                    />
                )}
                label={strings.activeDrefOperationsLabel}
                withShadow
            />
            <KeyFigureView
                icon={<AppealsIcon />}
                value={data.active_appeals}
                valueType="number"
                info={(
                    <InfoPopup
                        title={strings.countryOngoingActivitiesKeyFiguresAppealsTitle}
                        description={
                            strings.countryOngoingActivitiesFigureAppealDescription
                        }
                    />
                )}
                label={strings.countryOngoingActivitiesKeyFiguresActiveAppeals}
                withShadow
            />
            <KeyFigureView
                icon={<TargetedPopulationIcon />}
                value={data.target_population}
                valueType="number"
                valueOptions={{ compact: true }}
                label={strings.countryOngoingActivitiesKeyFiguresTargetPop}
                withShadow
            />
            <KeyFigureView
                icon={<FundingIcon />}
                value={data.amount_requested_dref_included}
                valueType="number"
                valueOptions={{ compact: true }}
                label={strings.countryOngoingActivitiesKeyFiguresBudget}
                withShadow
            />
            <KeyFigureView
                icon={<FundingCoverageIcon />}
                value={getPercentage(
                    data.amount_funded_dref_included,
                    data.amount_requested_dref_included,
                )}
                valueType="number"
                valueOptions={{
                    suffix: '%',
                    compact: true,
                }}
                label={strings.countryOngoingActivitiesKeyFiguresAppealsFunding}
                withShadow
            />
        </ListView>
    );
}

export default CountryKeyFigures;
