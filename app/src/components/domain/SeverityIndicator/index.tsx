import {
    ColorPreview,
    type ColorPreviewProps,
} from '@ifrc-go/ui';
import { isNotDefined } from '@togglecorp/fujs';

interface Props extends Omit<ColorPreviewProps, 'value'> {
    level: number | undefined | null;
    title?: string;
}

function SeverityIndicator(props: Props) {
    const {
        level,
        title,
        ...otherProps
    } = props;

    const colorMap: Record<number, string | undefined> = {
        0: 'var(--go-ui-color-yellow)',
        1: 'var(--go-ui-color-orange)',
        2: 'var(--go-ui-color-red)',
    };

    if (isNotDefined(level)) {
        return null;
    }

    const value = colorMap[level];

    if (isNotDefined(value)) {
        return null;
    }

    return (
        <ColorPreview
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...otherProps}
            title={title}
            value={value}
        />
    );
}

export default SeverityIndicator;
