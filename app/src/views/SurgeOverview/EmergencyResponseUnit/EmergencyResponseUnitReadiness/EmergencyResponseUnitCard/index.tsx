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

import { type GoApiResponse } from '#utils/restRequest';

import ReadinessIcon from '../ReadinessIcon';

import i18n from './i18n.json';

type GetEruReadinessResponse = GoApiResponse<'/api/v2/eru-readiness-type/'>;

export type ReadinessList = Array<NonNullable<NonNullable<GetEruReadinessResponse['results']>[0]> & {
    eruOwner: NonNullable<NonNullable<NonNullable<GetEruReadinessResponse['results']>[0]>['eru_readiness']>[0]['eru_owner_details'];
    updatedAt: NonNullable<NonNullable<NonNullable<GetEruReadinessResponse['results']>[0]>['eru_readiness']>[0]['updated_at'];
}>

interface Props {
    className?: string;
    typeDisplay: string;
    nationalSocieties: string;
    fundingReadiness: number | undefined;
    equipmentReadiness: number | undefined;
    peopleReadiness: number | undefined;
    updatedAt: number | undefined;
    readinessList: ReadinessList;
}

function EmergencyResponseUnitTypeCard(props: Props) {
    const {
        className,
        typeDisplay,
        nationalSocieties,
        fundingReadiness,
        equipmentReadiness,
        peopleReadiness,
        updatedAt,
        readinessList,
    } = props;

    const strings = useTranslation(i18n);

    const [
        showReadinessInfo,
        {
            setTrue: setShowReadinessInfoTrue,
            setFalse: setShowReadinessInfoFalse,
        },
    ] = useBooleanState(false);

    return (
        <Container
            className={className}
            withHeaderBorder
            heading={typeDisplay}
            headingLevel={4}
            headerDescription={(
                <TextOutput
                    label={strings.emergencyResponseUnitOwnerCardLastUpdated}
                    value={updatedAt}
                    valueType="date"
                    textSize="sm"
                />
            )}
            withFooterBorder
            footerActions={(
                <Button
                    name={undefined}
                    onClick={setShowReadinessInfoTrue}
                    styleVariant="action"
                    title={strings.eruSeeReadinessInfoButton}
                >
                    {strings.eruSeeReadinessInfoButton}
                </Button>
            )}
            withPadding
            withBackground
            withShadow
        >
            <ListView layout="block">
                <TextOutput
                    label={strings.emergencyResponseUnitNationalSociety}
                    value={nationalSocieties}
                    strongValue
                />
                <ListView
                    layout="grid"
                    numPreferredGridColumns={3}
                    minGridColumnSize="6rem"
                >
                    <ReadinessIcon
                        readinessType={equipmentReadiness}
                        label={strings.eruEquipmentReadiness}
                    />
                    <ReadinessIcon
                        readinessType={peopleReadiness}
                        label={strings.eruPeopleReadiness}
                    />
                    <ReadinessIcon
                        readinessType={fundingReadiness}
                        label={strings.eruFundingReadiness}
                    />
                </ListView>
            </ListView>
            {showReadinessInfo && (
                <Modal
                    heading={typeDisplay}
                    headerDescription={strings.eruReadinessInformationHeading}
                    onClose={setShowReadinessInfoFalse}
                    size="md"
                    withoutSpacingOpticalCorrection
                >
                    <ListView
                        layout="block"
                        spacing="2xs"
                    >
                        {readinessList?.map((readiness) => (
                            <Container
                                key={readiness.id}
                                heading={
                                    readiness.eruOwner.national_society_country_details.society_name
                                }
                                headingLevel={5}
                                withDarkBackground
                                withPadding
                            >
                                <ListView
                                    layout="grid"
                                    numPreferredGridColumns={3}
                                    minGridColumnSize="6rem"
                                >
                                    <ReadinessIcon
                                        readinessType={readiness.equipment_readiness}
                                        label={strings.eruEquipmentReadiness}
                                    />
                                    <ReadinessIcon
                                        readinessType={readiness.people_readiness}
                                        label={strings.eruPeopleReadiness}
                                    />
                                    <ReadinessIcon
                                        readinessType={readiness.funding_readiness}
                                        label={strings.eruFundingReadiness}
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

export default EmergencyResponseUnitTypeCard;
