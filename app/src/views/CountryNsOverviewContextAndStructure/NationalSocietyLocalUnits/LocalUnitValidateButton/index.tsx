import { Button } from '@ifrc-go/ui';
import { _cs } from '@togglecorp/fujs';

import { VALIDATED } from '../common';

import styles from './styles.module.css';

interface Props {
    status: number | undefined;
    onClick: () => void;
    hasValidatePermission: boolean;
}
function LocalUnitValidateButton(props: Props) {
    const {
        status,
        // statusDetails,
        onClick,
        hasValidatePermission,
    } = props;

    const isValidated = status === VALIDATED;

    if (isValidated || !hasValidatePermission) {
        return null;
    }

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
            // FIXME: use translations
        >
            Review
        </Button>
    );
}

export default LocalUnitValidateButton;
