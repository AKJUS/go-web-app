import {
    Container,
    Description,
    ListView,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { _cs } from '@togglecorp/fujs';

import Page from '#components/Page';

import i18n from './i18n.json';
import styles from './styles.module.css';

interface Props {
    className?: string;
    variant?: 'page' | 'component';
}

function ThreeWDecommissionMessage(props: Props) {
    const {
        className,
        variant = 'component',
    } = props;

    const strings = useTranslation(i18n);

    if (variant === 'page') {
        return (
            <Page
                title={strings.title}
                heading={strings.pageHeading}
                mainSectionClassName={styles.threeWDecommissionPage}
            >
                <ListView layout="block">
                    <Description>
                        {strings.description}
                    </Description>
                    <Container
                        heading={strings.rationaleHeading}
                        headingLevel={4}
                    >
                        {strings.rationale}
                    </Container>
                </ListView>
            </Page>
        );
    }

    return (
        <Container
            className={_cs(className, styles.threeWDecommissionMessage)}
            heading={strings.heading}
            withHeaderBorder
        >
            <ListView layout="block">
                <Description>
                    {strings.description}
                </Description>
                <Container
                    heading={strings.rationaleHeading}
                    headingLevel={4}
                >
                    {strings.rationale}
                </Container>
            </ListView>
        </Container>
    );
}

export default ThreeWDecommissionMessage;
