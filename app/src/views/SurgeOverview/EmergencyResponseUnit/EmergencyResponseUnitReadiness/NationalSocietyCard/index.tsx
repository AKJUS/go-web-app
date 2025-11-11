import {
    Button,
    Container,
    ListView,
    Modal,
    TextOutput,
} from '@ifrc-go/ui';
import {
    useBooleanState,
    useTranslation,
} from '@ifrc-go/ui/hooks';

import { joinStrings } from '#utils/common';
import { type GoApiResponse } from '#utils/restRequest';

import ReadinessIcon from '../ReadinessIcon';

import i18n from './i18n.json';

type GetEruReadinessResponse = GoApiResponse<'/api/v2/eru-readiness/'>;
type EruReadinessListItem = NonNullable<GetEruReadinessResponse['results']>[number];

interface Props {
    className?: string;
    eruData: EruReadinessListItem;
}

function NationalSocietyTypeCard(props: Props) {
    const {
        className,
        eruData,
    } = props;

    const strings = useTranslation(i18n);

    const [
        showReadinessInfo,
        {
            setTrue: setShowReadinessInfoTrue,
            setFalse: setShowReadinessInfoFalse,
        },
    ] = useBooleanState(false);

    const eruTypes = joinStrings(eruData.eru_types.map((eruType) => eruType.type_display));

    return (
        <Container
            className={className}
            withHeaderBorder
            withFooterBorder
            heading={eruData?.eru_owner_details?.national_society_country_details?.society_name ?? '??'}
            headerDescription={(
                <TextOutput
                    label={strings.emergencyResponseUnitOwnerNSCardLastUpdated}
                    value={eruData.updated_at}
                    valueType="date"
                    textSize="sm"
                />
            )}
            footerActions={(
                <Button
                    name={undefined}
                    onClick={setShowReadinessInfoTrue}
                    styleVariant="action"
                    title={strings.eruNSSeeReadinessInfoButton}
                >
                    {strings.eruNSSeeReadinessInfoButton}
                </Button>
            )}
            withPadding
            withShadow
            withBackground
        >
            <TextOutput
                label={strings.eruTypesLabel}
                value={eruTypes}
                strongValue
            />
            {showReadinessInfo && (
                <Modal
                    heading={
                        eruData.eru_owner_details.national_society_country_details.society_name
                    }
                    headerDescription={strings.eruNSReadinessInformationHeading}
                    onClose={setShowReadinessInfoFalse}
                    size="md"
                    withContentWell
                    withoutSpacingOpticalCorrection
                >
                    <ListView layout="block">
                        {eruData.eru_types.map((eruType) => (
                            <Container
                                key={eruType.id}
                                heading={eruType.type_display}
                                headingLevel={5}
                                withBackground
                                withPadding
                            >
                                <ListView
                                    layout="grid"
                                    minGridColumnSize="10rem"
                                    numPreferredGridColumns={3}
                                >
                                    <ReadinessIcon
                                        readinessType={eruType.equipment_readiness}
                                        label={strings.eruNSEquipmentReadiness}
                                    />
                                    <ReadinessIcon
                                        readinessType={eruType.people_readiness}
                                        label={strings.eruNSPeopleReadiness}
                                    />
                                    <ReadinessIcon
                                        readinessType={eruType.funding_readiness}
                                        label={strings.eruNSFundingReadiness}
                                    />
                                </ListView>
                            </Container>
                        ))}
                    </ListView>
                </Modal>
            )}
        </Container>
    );
}

export default NationalSocietyTypeCard;
