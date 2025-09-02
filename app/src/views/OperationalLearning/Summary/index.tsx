import {
    Description,
    ExpandableContainer,
    ListView,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { resolveToString } from '@ifrc-go/ui/utils';

import Sources from '../Sources';

import i18n from './i18n.json';

export interface Props {
    id: number;
    summaryType: 'sector' | 'component';
    summaryTitle: string;
    extractsCount: number;
    summaryContent: string | null | undefined;
}

function Summary(props: Props) {
    const {
        id,
        summaryType,
        summaryTitle,
        extractsCount,
        summaryContent,
    } = props;

    const strings = useTranslation(i18n);

    return (
        <ExpandableContainer
            heading={summaryTitle}
            headerDescription={(
                <ListView layout="block">
                    {extractsCount > 1 ? (
                        resolveToString(
                            strings.summaryExtractsCount,
                            { count: extractsCount },
                        )
                    ) : (
                        resolveToString(
                            strings.summaryExtractCount,
                            { count: extractsCount },
                        )
                    )}
                    <Description>
                        {summaryContent}
                    </Description>
                </ListView>
            )}
            withPadding
            withDarkBackground
            withToggleButtonOnFooter
            toggleButtonLabel={[strings.seeSources, strings.closeSources]}
        >
            <Sources
                summaryId={id}
                summaryType={summaryType}
            />
        </ExpandableContainer>
    );
}

export default Summary;
