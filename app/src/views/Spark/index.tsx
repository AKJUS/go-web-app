import { Container } from '@ifrc-go/ui';
import {
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';

import SparkEmbed from '#components/domain/SparkEmbed';
import Page from '#components/Page';
import { powerBiReportId1 } from '#config';
import { useRequest } from '#utils/restRequest';

// Backend returns snake_case keys
type BackendPowerBiAuth = {
    embed_url: string;
    embed_token: string;
    report_id?: string;
    expires_at?: string; // new field for expiry (ISO string)
};

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const {
        response: authRaw,
        pending,
        error,
    } = useRequest({
        skip: !powerBiReportId1,
        url: '/api/v2/auth-power-bi/',
        preserveResponse: true,
        query: powerBiReportId1 ? ({
            report_id: powerBiReportId1,
        }) : undefined,
    });

    // FIXME: the typings should be generated in the server
    const auth = authRaw as unknown as BackendPowerBiAuth | undefined;
    const embedUrl = auth?.embed_url;
    const accessToken = auth?.embed_token;
    const reportId = auth?.report_id;

    return (
        <Page
            // FIXME: use strings
            title="SPARK"
            // FIXME: use strings
            heading="SPARK"
        >
            <Container
                pending={pending}
                errored={!!error}
                errorMessage={error?.value.messageForNotification}
                empty={isNotDefined(powerBiReportId1)
                    || isNotDefined(embedUrl)
                    || isNotDefined(accessToken)}
                // FIXME: use strings
                emptyMessage="Page not available!"
            >
                {isDefined(embedUrl) && isDefined(accessToken) && (
                    <SparkEmbed
                        embedUrl={embedUrl}
                        accessToken={accessToken}
                        reportId={reportId}
                    />
                )}
            </Container>
        </Page>
    );
}

Component.displayName = 'Spark';
