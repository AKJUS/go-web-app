import { _cs } from '@togglecorp/fujs';

import type { Props as RawButtonProps } from '#components/Button';
import RawButton from '#components/RawButton';

import styles from './styles.module.css';

type IconButtonVariant = 'primary' | 'secondary' | 'tertiary';

export interface Props<N> extends RawButtonProps<N> {
    ariaLabel: string;
    disabled?: boolean;
    round?: boolean;
    title: string;
    variant?: IconButtonVariant;
}

function IconButton<N>(props: Props<N>) {
    const {
        ariaLabel,
        children,
        className,
        variant = 'tertiary',
        round = true,
        ...otherProps
    } = props;

    const buttonClassName = _cs(
        styles.button,
        styles[variant],
        round && styles.round,
        className,
    );

    return (
        <RawButton
            className={buttonClassName}
            aria-label={ariaLabel}
            {...otherProps} /* eslint-disable-line react/jsx-props-no-spreading */
        >
            {children}
        </RawButton>
    );
}

export default IconButton;
