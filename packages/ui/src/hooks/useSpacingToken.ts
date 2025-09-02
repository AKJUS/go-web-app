import {
    useEffect,
    useState,
} from 'react';
import {
    isNotDefined,
    randomString,
} from '@togglecorp/fujs';

import {
    getOpticallyCorrectedSpacingValue,
    getSpacingValue,
    SpacingMode,
    SpacingType,
} from '#utils/style';

interface Props {
    spacing?: SpacingType;
    offset?: number;
    modes?: SpacingMode[];
    withoutOpticalCorrection?: boolean;
    withAdditionalInlinePadding?: boolean;
}

function useSpacingToken(props: Props) {
    const [className] = useState(() => `spacing-token-${randomString()}`);

    const {
        spacing = 'md',
        modes = ['padding-inline', 'padding-block'],
        offset = 0,
        withoutOpticalCorrection,
        withAdditionalInlinePadding,
    } = props;

    useEffect(
        () => {
            if (isNotDefined(spacing)) {
                return undefined;
            }

            const spacingValue = getSpacingValue(spacing, offset);

            const style = document.createElement('style');
            document.head.appendChild(style);
            if (!style.sheet) {
                style.remove();
                return undefined;
            }

            const rules = modes.map((mode) => {
                if (mode === 'padding-inline' && withAdditionalInlinePadding) {
                    return `${mode}: calc(${spacingValue} * 1.5 + var(--go-ui-spacing-2xs))`;
                }

                if (withoutOpticalCorrection) {
                    return `${mode}: ${spacingValue}`;
                }

                return `${mode}: ${getOpticallyCorrectedSpacingValue(spacingValue, mode)}`;
            }).join('; ');

            style.sheet.insertRule(`.${className} { ${rules} }`);

            return () => {
                style.remove();
            };
        },
        [spacing, modes, className, offset, withoutOpticalCorrection, withAdditionalInlinePadding],
    );

    return className;
}

export default useSpacingToken;
