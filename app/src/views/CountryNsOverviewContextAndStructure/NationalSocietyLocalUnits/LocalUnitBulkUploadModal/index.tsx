import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { useOutletContext } from 'react-router-dom';
import { DownloadLineIcon } from '@ifrc-go/icons';
import {
    Button,
    ConfirmButton,
    Modal,
    RawFileInput,
    SelectInput,
    TextOutput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    numericIdSelector,
    resolveToString,
    stringNameSelector,
} from '@ifrc-go/ui/utils';
import {
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';
import { type Error } from '@togglecorp/toggle-form';

import Link from '#components/Link';
import NonFieldError from '#components/NonFieldError';
import usePermissions from '#hooks/domain/usePermissions';
import { type CountryOutletContext } from '#utils/outletContext';
import {
    type GoApiResponse,
    useLazyRequest,
    useRequest,
} from '#utils/restRequest';
import { transformObjectError } from '#utils/restRequest/error';

import { type ManageResponse } from '../common';
import FormGrid from '../FormGrid';
import { type PartialLocalUnits } from '../LocalUnitsFormModal/LocalUnitsForm/schema';

import i18n from './i18n.json';
import styles from './styles.module.css';

type BulkUploadResponse = NonNullable<GoApiResponse<'/api/v2/bulk-upload-local-unit/'>['results']>[number];
type BulkUploadEnumsResponse = NonNullable<GoApiResponse<'/api/v2/global-enums/'>['local_units_bulk_upload_status']>[number];

type BulkStatusKey = BulkUploadEnumsResponse['key'];

const BULK_UPLOAD_SUCCESS = 1 satisfies BulkStatusKey;
const BULK_UPLOAD_FAILED = 2 satisfies BulkStatusKey;
const BULK_UPLOAD_PENDING = 3 satisfies BulkStatusKey;

interface Props {
    onClose: () => void;
    manageResponse: ManageResponse;
}

function LocalUnitBulkUploadModal(props: Props) {
    const { onClose, manageResponse } = props;

    const strings = useTranslation(i18n);

    const { countryResponse } = useOutletContext<CountryOutletContext>();

    const [localUnitType, setLocalUnitType] = useState<number>();
    const [bulkUploadResponse, setBulkUploadResponse] = useState<BulkUploadResponse>();
    const [bulkUploadFile, setBulkUploadFile] = useState<File | undefined>();

    const [shouldPoll, setShouldPoll] = useState(false);

    const isExternallyManaged = useMemo(() => {
        if (isDefined(localUnitType) && isDefined(manageResponse)) {
            return manageResponse[localUnitType]?.enabled;
        }
        return false;
    }, [localUnitType, manageResponse]);

    const {
        isSuperUser,
        isLocalUnitGlobalValidatorByType,
        isLocalUnitRegionValidatorByType,
        isLocalUnitCountryValidatorByType,
    } = usePermissions();

    const hasBulkUploadPermission = isSuperUser
        || isLocalUnitGlobalValidatorByType(localUnitType)
        || isLocalUnitCountryValidatorByType(countryResponse?.id, localUnitType)
        || isLocalUnitRegionValidatorByType(countryResponse?.region, localUnitType);

    const {
        response: localUnitsOptions,
    } = useRequest({
        url: '/api/v2/local-units-options/',
    });

    const {
        response: bulkUploadHealthTemplate,
    } = useRequest({
        url: '/api/v2/bulk-upload-local-unit/get-bulk-upload-template/',
        pathVariables: { bulk_upload_template: 'health_care' },
    });

    const {
        response: bulkUploadDefaultTemplate,
    } = useRequest({
        url: '/api/v2/bulk-upload-local-unit/get-bulk-upload-template/',
        pathVariables: { bulk_upload_template: 'local_unit' },
    });

    const {
        response: uploadHistoryResponse,
        pending: uploadHistoryPending,
        retrigger: uploadHistory,
    } = useRequest({
        url: '/api/v2/bulk-upload-local-unit/',
        query: {
            country__id: countryResponse?.id,
        },
    });

    const {
        pending: bulkUploadPending,
        trigger: bulkUpload,
        error: bulkError,
    } = useLazyRequest({
        formData: true,
        url: '/api/v2/bulk-upload-local-unit/',
        method: 'POST',
        body: (body) => body as never,
        onSuccess: (response) => {
            setBulkUploadFile(undefined);
            setBulkUploadResponse(response);
            uploadHistory();
            setShouldPoll(true);
        },
    });

    const uploadResponse = useMemo(() => {
        const response = uploadHistoryResponse?.results.find(
            (upload) => upload.id === bulkUploadResponse?.id,
        );
        return response;
    }, [uploadHistoryResponse, bulkUploadResponse]);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        if (shouldPoll) {
            if (uploadResponse?.status === BULK_UPLOAD_PENDING
                || isNotDefined(uploadResponse?.status)) {
                timeoutId = setTimeout(() => {
                    uploadHistory();
                }, 2000);
            }

            if (uploadResponse?.status === BULK_UPLOAD_FAILED
                || uploadResponse?.status === BULK_UPLOAD_SUCCESS) {
                setShouldPoll(false);
            }
        }

        return () => clearTimeout(timeoutId);
    }, [uploadResponse, uploadHistory, uploadHistoryResponse, shouldPoll]);

    const error = transformObjectError(bulkError?.value.formErrors, () => undefined);

    const handleConfirmButton = useCallback(() => {
        if (
            isNotDefined(bulkUploadFile)
            || isNotDefined(countryResponse?.id)
            || isNotDefined(localUnitType)
        ) {
            return;
        }
        bulkUpload({
            country: countryResponse?.id,
            local_unit_type: localUnitType,
            file: bulkUploadFile,
        });
    }, [bulkUpload, localUnitType, bulkUploadFile, countryResponse?.id]);

    const permissionError = useMemo(() => {
        if (!hasBulkUploadPermission && !isExternallyManaged) {
            return strings.noPermissionBothDescription;
        }
        if (!hasBulkUploadPermission) {
            return strings.noPermissionErrorDescription;
        }
        if (!isExternallyManaged) {
            return strings.noPermissionExternallyManaged;
        }
        return undefined;
    }, [
        hasBulkUploadPermission,
        isExternallyManaged,
        strings.noPermissionBothDescription,
        strings.noPermissionExternallyManaged,
        strings.noPermissionErrorDescription,
    ]);

    const pending = bulkUploadPending || uploadHistoryPending || shouldPoll;

    return (
        <Modal
            heading={strings.bulkUploadModalHeading}
            headingLevel={2}
            pending={pending}
            size="xl"
            withHeaderBorder
            onClose={onClose}
            headerDescriptionContainerClassName={styles.headerDescriptionContent}
            spacing="relaxed"
            childrenContainerClassName={styles.bulkUploadContent}
            headerDescription={(
                <>
                    <TextOutput
                        label={strings.bulkUploadCountryLabel}
                        value={countryResponse?.name}
                    />
                    <FormGrid>
                        <SelectInput
                            required
                            nonClearable
                            label={strings.localUnitType}
                            value={localUnitType}
                            onChange={setLocalUnitType}
                            name="local_unit_type"
                            disabled={pending}
                            options={localUnitsOptions?.type}
                            keySelector={numericIdSelector}
                            labelSelector={stringNameSelector}
                        />
                    </FormGrid>
                </>
            )}
            footerActions={(
                <Button
                    name={undefined}
                    onClick={onClose}
                >
                    {strings.onCloseButtonLabel}
                </Button>
            )}
        >
            <div className={styles.uploadContainer}>
                {isDefined(localUnitType) ? (
                    <>
                        {isDefined(permissionError) && (
                            <NonFieldError error={permissionError} />
                        )}
                        <RawFileInput
                            name="file"
                            accept=".csv"
                            onChange={setBulkUploadFile}
                            variant="secondary"
                            disabled={!hasBulkUploadPermission || !isExternallyManaged || pending}
                        >
                            {strings.uploadButtonLabel}
                        </RawFileInput>
                        {bulkUploadFile?.name}
                        {isNotDefined(bulkUploadFile) && (
                            <div className={styles.uploadDescription}>
                                {strings.uploadDescription}
                                <NonFieldError error={error as Error<PartialLocalUnits>} />
                            </div>
                        )}
                        <ConfirmButton
                            name="file"
                            disabled={isNotDefined(bulkUploadFile)}
                            confirmHeading={strings.bulkUploadConfirmHeading}
                            confirmMessage={strings.bulkUploadConfirmMessage}
                            onConfirm={handleConfirmButton}
                        >
                            {strings.bulkUploadButtonLabel}
                        </ConfirmButton>
                    </>
                ) : (
                    <div>{strings.selectLocalUnitTypeDescription}</div>
                )}
            </div>
            {isDefined(uploadResponse) && isDefined(uploadResponse.error_message) && (
                <NonFieldError
                    error={uploadResponse.error_message}
                />
            )}
            {(isDefined(uploadResponse) && isNotDefined(uploadResponse.error_message)) && (
                <div className={styles.uploadInformationContainer}>
                    {uploadResponse?.status === BULK_UPLOAD_SUCCESS && (
                        <div className={styles.successResponseMessage}>
                            {resolveToString(
                                strings.bulkUploadSuccessMessage,
                                {
                                    type: uploadResponse.local_unit_type_details.name ?? '--',
                                    country: countryResponse?.name ?? '--',
                                },
                            )}
                        </div>
                    )}
                    {uploadResponse?.status === BULK_UPLOAD_FAILED && (
                        <NonFieldError
                            error={resolveToString(
                                strings.bulkUploadFailedMessage,
                                {
                                    type: uploadResponse.local_unit_type_details.name ?? '--',
                                    country: countryResponse?.name ?? '--',
                                },
                            )}
                        />
                    )}
                    <div className={styles.responseInformation}>
                        <div className={styles.countAndFile}>
                            <TextOutput
                                valueType="number"
                                strongLabel
                                label={strings.successCountLabel}
                                value={uploadResponse?.success_count}
                            />
                            <TextOutput
                                valueType="number"
                                strongLabel
                                label={strings.failedCountLabel}
                                value={uploadResponse?.failed_count}
                            />
                        </div>
                        <div className={styles.countAndFile}>
                            {isDefined(uploadResponse?.file) && (
                                <Link
                                    external
                                    href={uploadResponse?.file}
                                    variant="secondary"
                                    icons={<DownloadLineIcon className={styles.icon} />}
                                >
                                    {uploadResponse?.file_name}
                                </Link>
                            )}
                            {isDefined(uploadResponse?.error_file) && (
                                <Link
                                    external
                                    href={uploadResponse?.error_file}
                                    variant="secondary"
                                    icons={<DownloadLineIcon className={styles.icon} />}
                                >
                                    {strings.errorsFileLabel}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div className={styles.uploadFormat}>
                <div>{strings.bulkUploadFormatDescription}</div>
                <div className={styles.uploadContent}>
                    <Link
                        external
                        href={bulkUploadDefaultTemplate?.template_url}
                        variant="secondary"
                        icons={<DownloadLineIcon className={styles.icon} />}
                    >
                        {strings.bulkUploadFormat}
                    </Link>
                    <Link
                        external
                        href={bulkUploadHealthTemplate?.template_url}
                        variant="secondary"
                        // FIXME fix styling
                        iconsContainerClassName={styles.downloadLink}
                        icons={<DownloadLineIcon className={styles.icon} />}
                    >
                        {strings.bulkUploadHealthFormat}
                    </Link>
                </div>
            </div>
        </Modal>
    );
}

export default LocalUnitBulkUploadModal;
