import { useMemo } from 'react';
import {
    CheckboxCircleLineIcon,
    CloseCircleLineIcon,
} from '@ifrc-go/icons';
import { Label } from '@ifrc-go/ui';
import { isDefined } from '@togglecorp/fujs';

import {
    ERU_READINESS_CAN_CONTRIBUTE,
    ERU_READINESS_NO_CAPACITY,
    ERU_READINESS_READY,
} from '#utils/constants';

import styles from './styles.module.css';

interface Props {
    readinessType: number | undefined;
    label?: React.ReactNode;
}

function ReadinessIcon(props: Props) {
    const {
        readinessType,
        label,
    } = props;

    const icon = useMemo(() => {
        if (readinessType === ERU_READINESS_NO_CAPACITY) {
            return <CloseCircleLineIcon className={styles.redIcon} />;
        }
        if (readinessType === ERU_READINESS_CAN_CONTRIBUTE) {
            return <CheckboxCircleLineIcon className={styles.yellowIcon} />;
        }
        if (readinessType === ERU_READINESS_READY) {
            return <CheckboxCircleLineIcon className={styles.greenIcon} />;
        }
        return <CheckboxCircleLineIcon className={styles.grayIcon} />;
    }, [readinessType]);

    return (
        <div className={styles.readinessIcon}>
            <div className={styles.icon}>
                {icon}
            </div>
            <Label>
                {isDefined(label) && label}
            </Label>
        </div>
    );
}

export default ReadinessIcon;
