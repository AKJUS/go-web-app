import { useTranslation } from '@ifrc-go/ui/hooks';

import Link from '#components/Link';

import i18n from './i18n.json';
import styles from './styles.module.css';

export interface Props {
    errorsLink?: string | null;
    originalFileLink?: string;
}

function TableActions(props: Props) {
    const {
        originalFileLink,
        errorsLink,
    } = props;

    const strings = useTranslation(i18n);
    return (
        <div className={styles.tableActions}>
            {errorsLink && (
                <Link
                    external
                    variant="secondary"
                    href={errorsLink}
                >
                    {strings.errorsLabel}
                </Link>
            )}
            {originalFileLink && (
                <Link
                    external
                    href={originalFileLink}
                    variant="secondary"
                >
                    {strings.originalFileLabel}
                </Link>
            )}
        </div>
    );
}

export default TableActions;
