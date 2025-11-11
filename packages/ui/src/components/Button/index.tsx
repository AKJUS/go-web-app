import ButtonLayout, { Props as ButtonLayoutProps } from '#components/ButtonLayout';
import RawButton, { Props as RawButtonProps } from '#components/RawButton';

import styles from './styles.module.css';

type PickedButtonLayoutProps =
    | 'colorVariant'
    | 'styleVariant'
    | 'spacing'
    | 'spacingOffset'
    | 'withoutPadding'
    | 'withFullWidth'
    | 'children'
    | 'before'
    | 'textSize'
    | 'after'

export type Props<NAME> = Omit<RawButtonProps<NAME>, 'elementRef' | 'children'>
& Pick<ButtonLayoutProps, PickedButtonLayoutProps>
& {
    layoutElementRef?: ButtonLayoutProps['elementRef'];
};

function Button<const NAME>(props: Props<NAME>) {
    const {
        colorVariant = 'primary',
        styleVariant = 'outline',
        spacing,
        spacingOffset = -3,
        withoutPadding,
        withFullWidth,
        before,
        after,
        textSize,

        layoutElementRef,

        name,
        onClick,
        children,
        disabled,

        className,
        type = 'button',

        ...rawButtonProps
    } = props;

    return (
        <RawButton
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...rawButtonProps}
            className={styles.button}
            name={name}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            <ButtonLayout
                className={className}
                elementRef={layoutElementRef}
                colorVariant={colorVariant}
                styleVariant={styleVariant}
                spacing={spacing}
                spacingOffset={spacingOffset}
                withoutPadding={withoutPadding}
                withFullWidth={withFullWidth}
                before={before}
                after={after}
                textSize={textSize}
                disabled={disabled}
            >
                {children}
            </ButtonLayout>
        </RawButton>
    );
}

export default Button;
