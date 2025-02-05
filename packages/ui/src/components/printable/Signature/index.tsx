import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.css';

export interface Props {
    label: string;
    labelClassName?: string;
    strongLabel?: boolean;
}

function Signature(props: Props) {
    const {
        label,
        labelClassName,
        strongLabel,
    } = props;

    return (
        <div className={styles.signedContainer}>
            <div className={styles.signaturePlace} />
            <div className={styles.line} />
            <div
                className={_cs(
                    styles.label,
                    strongLabel && styles.strong,
                    labelClassName,
                )}
            >
                {label}
            </div>
        </div>
    );
}

export default Signature;
