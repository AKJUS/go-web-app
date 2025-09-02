import {
    Container,
    Label,
    ListView,
    TextOutput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { isDefined } from '@togglecorp/fujs';

import { type GoApiResponse } from '#utils/restRequest';

import i18n from './i18n.json';

type ProjectItem = NonNullable<GoApiResponse<'/api/v2/emergency-project/'>['results']>[number];
type ActivityItem = NonNullable<ProjectItem['activities']>[number];

export type Props = {
    activityItem: ActivityItem;

    supplyMapping: {
        [key: number]: { id: number, title: string };
    } | undefined;
}

function ActivityListItem(props: Props) {
    const {
        activityItem,
        supplyMapping,
    } = props;

    const strings = useTranslation(i18n);

    const {
        action_details,
        custom_action,
        custom_supplies,
        female_count,
        household_count,
        is_simplified_report,
        male_count,
        people_count,
        people_households,
        sector_details,
        supplies,
    } = activityItem;

    return (
        <Container
            heading={action_details?.title ?? custom_action}
            headingLevel={4}
        >
            <ListView
                layout="block"
                withSpacingOpticalCorrection
            >
                <ListView
                    layout="block"
                    spacing="2xs"
                    withSpacingOpticalCorrection
                >
                    <TextOutput
                        label={strings.emergencySector}
                        value={sector_details?.title}
                        strongLabel
                    />
                    <Label>
                        {action_details?.title}
                    </Label>
                    {is_simplified_report && people_households === 'people' && (
                        <>
                            {(isDefined(male_count) || isDefined(female_count)) && (
                                <>
                                    <TextOutput
                                        label={strings.emergencyMale}
                                        value={male_count}
                                        strongLabel
                                    />
                                    <TextOutput
                                        label={strings.emergencyFemale}
                                        value={female_count}
                                        strongLabel
                                    />
                                </>
                            )}
                            <TextOutput
                                label={strings.emergencyTotalPeople}
                                value={people_count}
                                strongLabel
                            />
                        </>
                    )}
                    {people_households === 'households' && (
                        <TextOutput
                            label={strings.emergencyTotalHouseholds}
                            value={household_count}
                            strongLabel
                        />
                    )}
                </ListView>
                {/* TODO: only show if action type and not cash type */}
                {isDefined(supplies) && Object.keys(supplies).length > 0 && (
                    <Container
                        heading={strings.emergencySupplies}
                        headingLevel={5}
                        spacing="none"
                    >
                        <ListView
                            layout="block"
                            withSpacingOpticalCorrection
                            spacing="2xs"
                        >
                            {Object.entries(supplies).map(([supply, value]) => (
                                <TextOutput
                                    key={supply}
                                    label={supplyMapping?.[Number(supply)]?.title}
                                    value={value}
                                />
                            ))}
                        </ListView>
                    </Container>
                )}
                {/* TODO: only show if custom type or action type and not cash type */}
                {Object.keys(custom_supplies).length > 0 && (
                    <Container
                        heading={strings.emergencyCustomSupplies}
                        headingLevel={5}
                        spacing="none"
                    >
                        <ListView
                            layout="block"
                            withSpacingOpticalCorrection
                            spacing="2xs"
                        >
                            {Object.entries(custom_supplies).map(([supply, value]) => (
                                <TextOutput
                                    key={supply}
                                    label={supply}
                                    value={value}
                                />
                            ))}
                        </ListView>
                    </Container>
                )}
            </ListView>
        </Container>
    );
}

export default ActivityListItem;
