import { useMemo } from 'react';
import { _cs } from '@togglecorp/fujs';

import BooleanOutput, { Props as BooleanOutputProps } from '#components/BooleanOutput';
import DateOutput, { Props as DateOutputProps } from '#components/DateOutput';
import NumberOutput, { Props as NumberOutputProps } from '#components/NumberOutput';

import styles from './styles.module.css';

interface CommonProps {
    className?: string;
    label?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

interface BooleanProps {
    valueType: 'boolean',
    value: BooleanOutputProps['value'];
    valueOptions?: Omit<BooleanOutputProps, 'value'>
}

interface NumberProps {
    valueType: 'number',
    value: NumberOutputProps['value'];
    valueOptions?: Omit<NumberOutputProps, 'value'>;
}

interface DateProps {
    valueType: 'date',
    value: DateOutputProps['value'],
    valueOptions?: Omit<DateOutputProps, 'value'>;
}

interface TextProps {
    valueType: 'text',
    value: string | null | undefined;
    valueOptions?: never;
}

export type Props = CommonProps & (
    BooleanProps | NumberProps | DateProps | TextProps
);

function KeyFigure(props: Props) {
    const {
        className,
        label,
        size = 'md',

        valueType,
        value,
        valueOptions,
    } = props;

    const valueComponent = useMemo(() => {
        if (valueType === 'boolean') {
            return (
                <BooleanOutput
                    value={value}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...valueOptions}
                />
            );
        }

        if (valueType === 'number') {
            return (
                <NumberOutput
                    value={value}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...valueOptions}
                />
            );
        }

        if (valueType === 'date') {
            return (
                <DateOutput
                    value={value}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...valueOptions}
                />
            );
        }

        return value;
    }, [valueType, value, valueOptions]);

    return (
        <div
            className={_cs(
                styles.keyFigure,
                size === 'sm' && styles.smallSize,
                size === 'md' && styles.mediumSize,
                size === 'lg' && styles.largeSize,
                className,
            )}
        >
            <div className={styles.value}>
                {valueComponent}
            </div>
            <div className={styles.label}>
                {label}
            </div>
        </div>
    );
}

export default KeyFigure;
