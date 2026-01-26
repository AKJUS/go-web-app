import {
    Container,
    Description,
    ListView,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import Link from '#components/Link';
import Page from '#components/Page';

import i18n from './i18n.json';
import styles from './styles.module.css';

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const strings = useTranslation(i18n);

    return (
        <Page
            title={strings.montandonPageTitle}
            heading={strings.montandonHeading}
            description={strings.montandonHeadingDescription}
            mainSectionClassName={styles.content}
            info={(
                <iframe
                    className={styles.iframe}
                    src="https://www.youtube.com/embed/BEWxqYfrQek"
                    title={strings.videoTitle}
                    allow=""
                    allowFullScreen
                />
            )}
        >
            <Container
                footerActions={(
                    <ListView
                        withWrap
                        spacing="sm"
                    >
                        <Link
                            href="https://montandon-eoapi-stage.ifrc.org/stac/api.html"
                            colorVariant="primary"
                            styleVariant="outline"
                            external
                            withLinkIcon
                            // NOTE: This is temporary till this Montandon link
                            // is up and running
                            style={{ pointerEvents: 'none' }}
                            disabled
                        >
                            {strings.accessAPILabel}
                        </Link>
                        <Link
                            href="https://radiantearth.github.io/stac-browser/#/external/montandon-eoapi-stage.ifrc.org/stac/"
                            colorVariant="primary"
                            styleVariant="outline"
                            external
                            withLinkIcon
                            // NOTE: This is temporary till this Montandon link
                            // is up and running
                            style={{ pointerEvents: 'none' }}
                            disabled
                        >
                            {strings.exploreRadiantEarthLabel}
                        </Link>
                    </ListView>
                )}
                spacing="xl"
            >
                <ListView
                    layout="grid"
                    numPreferredGridColumns={3}
                    minGridColumnSize="20rem"
                >
                    <Container
                        className={styles.guideCard}
                        heading={strings.resources}
                        withHeaderBorder
                        withPadding
                        withBackground
                        withShadow
                    >
                        <ListView
                            layout="block"
                            withSpacingOpticalCorrection
                        >
                            <Link
                                href="https://github.com/IFRCGo/monty-stac-extension/blob/main/README.md"
                                external
                                withLinkIcon
                            >
                                {strings.visitGithub}
                            </Link>
                            <Link
                                href="https://go-wiki.ifrc.org/en/home"
                                external
                                withLinkIcon
                            >
                                {strings.goWiki}
                            </Link>
                            <Link
                                href="https://montandon-eoapi-stage.ifrc.org/stac/api"
                                external
                                withLinkIcon
                            >
                                {strings.apiDescription}
                            </Link>
                            <Link
                                href="https://montandon-eoapi-stage.ifrc.org/stac/api.html"
                                external
                                withLinkIcon
                            >
                                {strings.apiDocumentation}
                            </Link>
                        </ListView>
                    </Container>
                    <Container
                        heading={strings.blogPosts}
                        withPadding
                        withBackground
                        withShadow
                        withHeaderBorder
                    >
                        <ListView
                            layout="block"
                            withSpacingOpticalCorrection
                        >
                            <Link
                                href="https://ifrcgoproject.medium.com/toward-a-more-comprehensive-understanding-of-disasters-fc422d65377"
                                external
                                withLinkIcon
                            >
                                {strings.leveragingDataBlogPostTitle}
                            </Link>
                            <Link
                                href="https://ifrcgoproject.medium.com/scaled-up-ambitions-require-scaled-up-systems-4a92456fab59"
                                external
                                withLinkIcon
                            >
                                {strings.scaledUpSystemsBlogPostTitle}
                            </Link>
                        </ListView>
                    </Container>
                    <Container
                        heading={strings.contact}
                        withPadding
                        withBackground
                        withShadow
                        withHeaderBorder
                    >
                        <ListView
                            layout="block"
                            withSpacingOpticalCorrection
                        >
                            <Link
                                href="mailto:im@ifrc.org"
                                colorVariant="primary"
                                styleVariant="filled"
                                external
                                spacing="sm"
                            >
                                im@ifrc.org
                            </Link>
                            <Description>
                                {strings.contactText}
                            </Description>
                        </ListView>
                    </Container>
                </ListView>
            </Container>
        </Page>
    );
}

Component.displayName = 'montandonLandingPage';
