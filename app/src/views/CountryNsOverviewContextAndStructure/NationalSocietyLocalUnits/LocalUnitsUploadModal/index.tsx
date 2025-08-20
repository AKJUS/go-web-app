import { useMemo } from 'react';
import { DownloadLineIcon } from '@ifrc-go/icons';
import {
    Modal,
    Pager,
    Table,
    TextOutput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    createDateColumn,
    createElementColumn,
    createNumberColumn,
    createStringColumn,
    numericIdSelector,
} from '@ifrc-go/ui/utils';
import { isDefined } from '@togglecorp/fujs';

import Link from '#components/Link';
import SelectOutput, { type Props as SelectOutputProps } from '#components/SelectOutput';
import useGlobalEnums from '#hooks/domain/useGlobalEnums';
import useFilterState from '#hooks/useFilterState';
import { createLinkColumn } from '#utils/domain/tableHelpers';
import {
    type GoApiResponse,
    useRequest,
} from '#utils/restRequest';

import TableActions, { type Props as TableActionsProps } from './TableActions';

import i18n from './i18n.json';
import styles from './styles.module.css';

const PAGE_SIZE = 5;
type UploadHistoryData = NonNullable<GoApiResponse<'/api/v2/bulk-upload-local-unit/'>['results']>[number];
type BulkUploadEnumsResponse = NonNullable<GoApiResponse<'/api/v2/global-enums/'>['local_units_bulk_upload_status']>[number];

const statusKeySelector = (item: BulkUploadEnumsResponse) => item.key;
const statusValueSelector = (item: BulkUploadEnumsResponse) => item.value;

interface Props {
    onClose: () => void;
    country: string;
    countryId: number;
}

function LocalUnitsUploadModal(props: Props) {
    const { onClose, country, countryId } = props;

    const strings = useTranslation(i18n);

    const { local_units_bulk_upload_status: bulkUploadStatus } = useGlobalEnums();

    const {
        limit,
        offset,
        page,
        setPage,
    } = useFilterState<object>({
        filter: {},
        pageSize: PAGE_SIZE,
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
    } = useRequest({
        url: '/api/v2/bulk-upload-local-unit/',
        query: {
            country__id: countryId,
            limit,
            offset,
        },
    });

    const columns = useMemo(() => ([
        createLinkColumn<UploadHistoryData, number>(
            'name',
            strings.tableFileNameLabel,
            (item) => item.file_name,
            (item) => ({
                external: true,
                href: item.file,
            }),
        ),
        createNumberColumn<UploadHistoryData, number>(
            'size',
            strings.tableSizeLabel,
            (item) => item.file_size,
            {
                suffix: ' B',
            },
        ),
        createStringColumn<UploadHistoryData, number>(
            'uploadedBy',
            strings.tableUploadedByLabel,
            (item) => item.triggered_by_details.first_name,
        ),
        createDateColumn<UploadHistoryData, number>(
            'uploadedDate',
            strings.tableUploadedDateLabel,
            (item) => item.triggered_at,
        ),
        createElementColumn<
            UploadHistoryData,
            number,
            SelectOutputProps<number, BulkUploadEnumsResponse>
        >(
            'status',
            strings.tableStatusLabel,
            SelectOutput,
            (_, item) => ({
                name: 'status',
                value: item.status,
                options: bulkUploadStatus,
                keySelector: statusKeySelector,
                labelSelector: statusValueSelector,
            }),
        ),
        createElementColumn<UploadHistoryData, number, TableActionsProps>(
            'actions',
            strings.tableActionsLabel,
            TableActions,
            (_, item) => ({
                errorsLink: item?.error_file,
            }),
        ),
    ]), [
        bulkUploadStatus,
        strings.tableSizeLabel,
        strings.tableStatusLabel,
        strings.tableActionsLabel,
        strings.tableFileNameLabel,
        strings.tableUploadedByLabel,
        strings.tableUploadedDateLabel,
    ]);

    return (
        <Modal
            heading={strings.localUnitsUploadHeading}
            footerActions={isDefined(uploadHistoryResponse)
                && isDefined(uploadHistoryResponse.count) && (
                <Pager
                    activePage={page}
                    itemsCount={uploadHistoryResponse.count}
                    maxItemsPerPage={limit}
                    onActivePageChange={setPage}
                />
            )}
            headerDescription={(
                <TextOutput
                    label={strings.uploadCountryLabel}
                    value={country}
                />
            )}
            size="lg"
            onClose={onClose}
            childrenContainerClassName={styles.uploadContent}
        >
            <Table
                pending={uploadHistoryPending}
                filtered={false}
                columns={columns}
                keySelector={numericIdSelector}
                data={uploadHistoryResponse?.results}
            />
        </Modal>
    );
}

export default LocalUnitsUploadModal;
