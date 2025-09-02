import { WikiHelpSectionLineIcon } from '@ifrc-go/icons';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { _cs } from '@togglecorp/fujs';

import Link from '#components/Link';
import useCurrentLanguage from '#hooks/domain/useCurrentLanguage';

import i18n from './i18n.json';
import styles from './styles.module.css';

interface Props {
    pathName: string;
    className?: string;
}

function WikiLink(props: Props) {
    const {
        pathName,
        className,
    } = props;

    const strings = useTranslation(i18n);
    const lang = useCurrentLanguage();

    return (
        <Link
            className={_cs(styles.wikiLink, className)}
            href={`https://go-wiki.ifrc.org/${lang}/${pathName}`}
            title={strings.goWikiLabel}
            external
            withoutPadding
        >
            <WikiHelpSectionLineIcon className={styles.icon} />
        </Link>
    );
}

export default WikiLink;
