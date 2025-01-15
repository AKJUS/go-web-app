import { CheckboxCircleLineIcon } from '@ifrc-go/icons';
import { Button } from '@ifrc-go/ui';
import { _cs } from '@togglecorp/fujs';

import { VALIDATED } from '../common';

import styles from './styles.module.css';

interface Props {
    status: number | undefined;
    statusDetails: string;
    onClick: () => void;
    hasValidatePermission: boolean;
}
function LocalUnitValidateButton(props: Props) {
    const {
        status,
        statusDetails,
        onClick,
        hasValidatePermission,
    } = props;

    const isValidated = status === VALIDATED;

    return (
        <Button
            className={_cs(isValidated
                ? styles.localUnitValidatedButton
                : styles.localUnitValidateButton)}
            name={undefined}
            onClick={onClick}
            spacing="compact"
            disabled={
                !hasValidatePermission
                || isValidated
            }
            icons={
                isValidated
                && (
                    <CheckboxCircleLineIcon
                        className={styles.icon}
                    />
                )
            }
        >
            {statusDetails}
        </Button>
    );
}

export default LocalUnitValidateButton;
