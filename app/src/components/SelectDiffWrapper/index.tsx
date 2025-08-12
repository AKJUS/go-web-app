import { useMemo } from 'react';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { isNotDefined } from '@togglecorp/fujs';

import SelectOutput from '#components/SelectOutput';

import i18n from './i18n.json';
import styles from './styles.module.css';

interface Props<VALUE, OPTION> {
    diffContainerClassName?: string;
    value: VALUE | undefined;
    oldValue?: VALUE | undefined;
    options: OPTION[] | undefined;
    keySelector: (datum: OPTION) => VALUE;
    labelSelector: (datum: OPTION) => React.ReactNode;
    children: React.ReactNode;
    enabled: boolean;
    showOnlyDiff?: boolean;
    showPreviousValue?: boolean;
}

function SelectDiffWrapper<
    VALUE, OPTION
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
            {showPreviousValue && (
                <SelectOutput
                    className={styles.selectPreviousValue}
                    label={strings.selectPreviousValueLabel}
                    value={oldValue}
                    options={options}
                    keySelector={keySelector}
                    labelSelector={labelSelector}
                />
            )}
        </div>
    );
}

export default SelectDiffWrapper;
