import { useMemo } from 'react';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { isNotDefined } from '@togglecorp/fujs';

import MultiSelectOutput from '../MultiSelectOutput';

import i18n from './i18n.json';
import styles from './styles.module.css';

interface Props<VALUE, OPTION> {
    value: VALUE[] | undefined;
    oldValue: VALUE[] | undefined;
    options: OPTION[] | undefined;
    keySelector: (datum: OPTION) => VALUE;
    labelSelector: (datum: OPTION) => React.ReactNode;
    diffContainerClassName?: string;
    children: React.ReactNode;
    enabled: boolean;
    showOnlyDiff?: boolean;
    showPreviousValue?: boolean;
}

function MultiSelectDiffWrapper<
    VALUE extends number | string, OPTION
>(
    props: Props<VALUE, OPTION>,
) {
    const {
        diffContainerClassName,
        oldValue,
        value,
        children,
        enabled = false,
        showOnlyDiff,
        showPreviousValue,
        options,
        keySelector,
        labelSelector,
    } = props;

    const strings = useTranslation(i18n);

    const hasChanged = useMemo(() => {
        // NOTE: we consider `null` and `undefined` as same for
        // this scenario
        if (isNotDefined(oldValue) && isNotDefined(value)) {
            return false;
        }

        return JSON.stringify(oldValue) !== JSON.stringify(value);
    }, [oldValue, value]);

    if (!enabled) {
        return children;
    }

    if (!hasChanged && showOnlyDiff) {
        return null;
    }

    if (!hasChanged) {
        return children;
    }

    return (
        <div className={diffContainerClassName}>
            {children}
            {showPreviousValue
                && (
                    <MultiSelectOutput
                        className={styles.previousValue}
                        label={strings.multiSelectPreviousValueLabel}
                        value={oldValue}
                        options={options}
                        keySelector={keySelector}
                        labelSelector={labelSelector}
                    />
                )}
        </div>
    );
}

export default MultiSelectDiffWrapper;
