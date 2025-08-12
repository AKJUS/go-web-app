import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useOutletContext } from 'react-router-dom';
import { CloseLineIcon } from '@ifrc-go/icons';
import {
    Button,
    Container,
    IconButton,
    Tab,
    TabList,
    TabPanel,
    Tabs,
} from '@ifrc-go/ui';
import {
    useBooleanState,
    useTranslation,
} from '@ifrc-go/ui/hooks';
import {
    _cs,
    isDefined,
    isNotDefined,
    listToMap,
} from '@togglecorp/fujs';

import useAuth from '#hooks/domain/useAuth';
import usePermissions from '#hooks/domain/usePermissions';
import useFilterState from '#hooks/useFilterState';
import { type CountryOutletContext } from '#utils/outletContext';
import {
    useLazyRequest,
    useRequest,
} from '#utils/restRequest';

import { type ManageResponse } from './common';
import Filters, { type FilterValue } from './Filters';
import LocalUnitBulkUploadModal from './LocalUnitBulkUploadModal';
import LocalUnitsFormModal from './LocalUnitsFormModal';
import LocalUnitsMap from './LocalUnitsMap';
import LocalUnitsTable from './LocalUnitsTable';
import LocalUnitsUploadModal from './LocalUnitsUploadModal';
import ManageLocalUnitsModal from './ManageLocalUnitsModal';

import i18n from './i18n.json';
import styles from './styles.module.css';

interface Props {
    className?: string;
}

function NationalSocietyLocalUnits(props: Props) {
    const {
        className,
    } = props;

    const [activeTab, setActiveTab] = useState<'map' | 'table'>('map');
    const { isAuthenticated } = useAuth();
    const { countryResponse } = useOutletContext<CountryOutletContext>();
    const {
        isSuperUser,
        isGuestUser,
        isLocalUnitGlobalValidator,
        isLocalUnitRegionValidator,
        isLocalUnitCountryValidator,
    } = usePermissions();
    const containerRef = useRef<HTMLDivElement>(null);

    // NOTE: key is used to refresh the page when local unit data is updated
    const [localUnitUpdateKey, setLocalUnitUpdateKey] = useState(0);
    const [manageResponse, setManageResponse] = useState<ManageResponse>();

    const [
        presentationMode,
        setFullScreenMode,
    ] = useState(false);

    const [showAddEditModal, {
        setTrue: setShowAddEditModalTrue,
        setFalse: setShowAddEditModalFalse,
    }] = useBooleanState(false);

    const [showBulkUploadModal, {
        setTrue: setShowBulkUploadModalTrue,
        setFalse: setShowBulkUploadModalFalse,
    }] = useBooleanState(false);

    const [showManageLocalUnitModal, {
        setTrue: setShowManageLocalUnitModalTrue,
        setFalse: setShowManageLocalUnitModalFalse,
    }] = useBooleanState(false);

    const [showUploadsModal, {
        setTrue: setShowUploadsModalTrue,
        setFalse: setShowUploadsModalFalse,
    }] = useBooleanState(false);

    const handleFullScreenChange = useCallback(() => {
        setFullScreenMode(isDefined(document.fullscreenElement));
    }, [setFullScreenMode]);

    const {
        filter,
        rawFilter,
        setFilterField,
        filtered,
        resetFilter,
    } = useFilterState<FilterValue>({
        filter: {},
        pageSize: 9999,
    });

    const {
        response: localUnitsOptions,
        pending: localUnitsOptionsPending,
    } = useRequest({
        url: '/api/v2/local-units-options/',
    });

    const {
        trigger: manageLocalUnits,
        pending: manageLocalUnitsPending,
    } = useLazyRequest({
        url: '/api/v2/externally-managed-local-unit/',
        query: {
            country__id: countryResponse?.id,
        },
        onSuccess: (response) => {
            const data = listToMap(
                response.results,
                (res) => res.local_unit_type_details.id,
                (res) => ({ enabled: res.enabled, externallyManagedId: res.id }),
            );
            setManageResponse(data);
        },
    });

    const pending = localUnitsOptionsPending || manageLocalUnitsPending;

    const handleFullScreenToggleClick = useCallback(() => {
        if (isNotDefined(containerRef.current)) {
            return;
        }
        const { current: viewerContainer } = containerRef;
        if (!presentationMode && isDefined(viewerContainer?.requestFullscreen)) {
            viewerContainer?.requestFullscreen();
        } else if (presentationMode && isDefined(document.exitFullscreen)) {
            document.exitFullscreen();
        }
    }, [presentationMode]);

    const handleLocalUnitsUpdate = useCallback(
        () => {
            manageLocalUnits({});
        },
        [manageLocalUnits],
    );

    const handleBulkUploadModalOpen = useCallback(
        () => {
            handleLocalUnitsUpdate();
            setShowBulkUploadModalTrue();
        },
        [handleLocalUnitsUpdate, setShowBulkUploadModalTrue],
    );

    const handleLocalUnitAddEditModalOpen = useCallback(
        () => {
            handleLocalUnitsUpdate();
            setShowAddEditModalTrue();
        },
        [handleLocalUnitsUpdate, setShowAddEditModalTrue],
    );

    const handleManageLocalUnitsModalOpen = useCallback(
        () => {
            handleLocalUnitsUpdate();
            setShowManageLocalUnitModalTrue();
        },
        [handleLocalUnitsUpdate, setShowManageLocalUnitModalTrue],
    );

    const handleLocalUnitFormModalClose = useCallback(
        () => {
            setShowAddEditModalFalse();
            setLocalUnitUpdateKey(new Date().getTime());
        },
        [setShowAddEditModalFalse],
    );

    const handleTabChanges = useCallback(
        (name: 'map' | 'table') => {
            handleLocalUnitsUpdate();
            setActiveTab(name);
        },
        [handleLocalUnitsUpdate],
    );

    const strings = useTranslation(i18n);

    const canSeeUploadButton = isSuperUser
        || isLocalUnitGlobalValidator()
        || isLocalUnitCountryValidator(countryResponse?.id)
        || isLocalUnitRegionValidator(countryResponse?.region ?? undefined);

    useEffect(() => {
        document.addEventListener('fullscreenchange', handleFullScreenChange);

        return (() => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
        });
    }, [handleFullScreenChange]);

    return (
        <Tabs
            onChange={handleTabChanges}
            value={activeTab}
            variant="tertiary"
        >
            <Container
                className={_cs(styles.nationalSocietyLocalUnits, className)}
                heading={strings.localUnitsTitle}
                childrenContainerClassName={styles.content}
                withHeaderBorder
                filterActions={isAuthenticated && !isGuestUser && (
                    <TabList>
                        <Tab name="map">{strings.localUnitsMapView}</Tab>
                        <Tab name="table">{strings.localUnitsListView}</Tab>
                    </TabList>
                )}
                filters={(
                    <Filters
                        value={rawFilter}
                        setFieldValue={setFilterField}
                        options={localUnitsOptions}
                        resetFilter={resetFilter}
                        filtered={filtered}
                    />
                )}
                actions={(
                    <>
                        {isAuthenticated && isSuperUser && (
                            <Button
                                name={undefined}
                                variant="secondary"
                                onClick={handleManageLocalUnitsModalOpen}
                            >
                                {strings.manageLocalUnitLabel}
                            </Button>
                        )}
                        {canSeeUploadButton && (
                            <>
                                <Button
                                    name={undefined}
                                    variant="secondary"
                                    onClick={setShowUploadsModalTrue}
                                >
                                    {strings.viewUploadsLabel}
                                </Button>
                                <Button
                                    name={undefined}
                                    variant="secondary"
                                    onClick={handleBulkUploadModalOpen}
                                >
                                    {strings.bulkUploadLabel}
                                </Button>
                            </>
                        )}
                        {isAuthenticated && (
                            <Button
                                name={undefined}
                                variant="secondary"
                                onClick={handleLocalUnitAddEditModalOpen}
                            >
                                {strings.addLocalUnitLabel}
                            </Button>
                        )}
                    </>
                )}
            >
                <TabPanel name="map">
                    <Container
                        className={_cs(presentationMode && styles.presentationMode)}
                        containerRef={containerRef}
                        actions={presentationMode && (
                            <IconButton
                                name={undefined}
                                onClick={handleFullScreenToggleClick}
                                title={strings.closePresentationLabel}
                                variant="secondary"
                                ariaLabel={strings.closePresentationLabel}
                            >
                                <CloseLineIcon />
                            </IconButton>
                        )}
                    >
                        <LocalUnitsMap
                            manageResponse={manageResponse}
                            key={localUnitUpdateKey}
                            onPresentationModeButtonClick={handleFullScreenToggleClick}
                            presentationMode={presentationMode}
                            filter={filter}
                            localUnitsOptions={localUnitsOptions}
                        />
                    </Container>
                </TabPanel>
                <TabPanel name="table">
                    <LocalUnitsTable
                        manageResponse={manageResponse}
                        key={localUnitUpdateKey}
                        filter={filter}
                        filtered={filtered}
                    />
                </TabPanel>
                {showAddEditModal && (
                    <LocalUnitsFormModal
                        manageResponse={manageResponse}
                        onClose={handleLocalUnitFormModalClose}
                    />
                )}
                {showBulkUploadModal && (
                    <LocalUnitBulkUploadModal
                        manageResponse={manageResponse}
                        onClose={setShowBulkUploadModalFalse}
                    />
                )}
                {showUploadsModal && isDefined(countryResponse?.name) && (
                    <LocalUnitsUploadModal
                        onClose={setShowUploadsModalFalse}
                        country={countryResponse.name}
                        countryId={countryResponse.id}
                    />
                )}
                {showManageLocalUnitModal && (
                    <ManageLocalUnitsModal
                        onClose={setShowManageLocalUnitModalFalse}
                        pending={pending}
                        onUpdate={handleLocalUnitsUpdate}
                        manageResponse={manageResponse}
                    />
                )}
            </Container>
        </Tabs>
    );
}

export default NationalSocietyLocalUnits;
