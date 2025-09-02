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

import { type GoApiResponse } from '#utils/restRequest';

import i18n from './i18n.json';

type FigureData = GoApiResponse<'/api/v2/country/{id}/figure/'>;

interface Props {
    className?: string;
    data: FigureData;
}

function CountryHistoricalKeyFigures(props: Props) {
    const {
        data,
        className,
    } = props;
    const strings = useTranslation(i18n);

    return (
        <ListView
            layout="grid"
            numPreferredGridColumns={5}
            className={className}
        >
            <KeyFigureView
                icon={<DrefIcon />}
                value={data.active_drefs}
                valueType="number"
                info={(
                    <InfoPopup
                        title={strings.keyFiguresDrefTitle}
                        description={strings.keyFiguresDref}
                    />
                )}
                label={strings.countryHistoricalDREFOperations}
                withShadow
            />
            <KeyFigureView
                icon={<AppealsIcon />}
                value={data.active_appeals}
                valueType="number"
                info={(
                    <InfoPopup
                        title={strings.keyFiguresEmergencyAppealTitle}
                        description={
                            strings.countryHistoricalFigureEmergencyAppealDescription
                        }
                    />
                )}
                label={strings.keyFiguresEmergencyAppeals}
                withShadow
            />
            <KeyFigureView
                icon={<TargetedPopulationIcon />}
                value={data.target_population}
                valueType="number"
                valueOptions={{ compact: true }}
                label={strings.keyFiguresTargetPopulation}
                withShadow
            />
            <KeyFigureView
                icon={<FundingIcon />}
                value={data.amount_requested_dref_included}
                valueType="number"
                valueOptions={{ compact: true }}
                label={strings.keyFiguresFundingRequirements}
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
                label={strings.keyFiguresAppealsFundingCoverage}
                withShadow
            />
        </ListView>
    );
}

export default CountryHistoricalKeyFigures;
