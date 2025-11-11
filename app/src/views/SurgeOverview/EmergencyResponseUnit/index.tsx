import TabPage from '#components/TabPage';
import OngoingEruDeployments from '#views/ActiveSurgeDeployments/OngoingEruDeployments';

import EmergencyResponseUnitReadiness from './EmergencyResponseUnitReadiness';

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    return (
        <TabPage>
            <EmergencyResponseUnitReadiness />
            <OngoingEruDeployments />
        </TabPage>
    );
}

Component.displayName = 'EmergencyResponseUnit';
