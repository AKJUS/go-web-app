import {
    CheckboxCircleLineIcon,
    CloseCircleLineIcon,
    EditCircleLineIcon,
    LockLineIcon,
} from '@ifrc-go/icons';
import { Tooltip } from '@ifrc-go/ui';
import { _cs } from '@togglecorp/fujs';

import {
    EXTERNALLY_MANAGED,
    PENDING_VALIDATION,
    UNVALIDATED,
    VALIDATED,
    type ValidationStatusKey,
} from '../common';

import styles from './styles.module.css';

export interface LocalUnitStatusProps {
    className?: string;
    value: ValidationStatusKey | undefined;
    valueDisplay: string | undefined;
    compact?: boolean;
}

function LocalUnitStatus(props: LocalUnitStatusProps) {
    const {
        value,
        className,
        valueDisplay,
        compact,
    } = props;

    return (
        <div
            className={_cs(
                styles.localUnitStatus,
                value === VALIDATED && styles.validated,
                value === UNVALIDATED && styles.unvalidated,
                value === PENDING_VALIDATION && styles.pendingValidation,
                value === EXTERNALLY_MANAGED && styles.externallyManaged,
                className,
            )}
        >
            {value === VALIDATED && (
                <CheckboxCircleLineIcon
                    className={styles.icon}
                />
            )}
            {value === PENDING_VALIDATION && (
                <EditCircleLineIcon
                    className={styles.icon}
                />
            )}
            {value === UNVALIDATED && (
                <CloseCircleLineIcon
                    className={styles.icon}
                />
            )}
            {value === EXTERNALLY_MANAGED && (
                <LockLineIcon
                    className={styles.icon}
                />
            )}
            {!compact && valueDisplay}
            {compact && valueDisplay && (
                <Tooltip
                    // FIXME: use translations
                    title="Status"
                    description={valueDisplay}
                />
            )}
        </div>
    );
}

export default LocalUnitStatus;
