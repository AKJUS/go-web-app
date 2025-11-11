import { CheckFillIcon } from '@ifrc-go/icons';
import { _cs } from '@togglecorp/fujs';

import InlineLayout, { type Props as InlineLayoutProps } from '#components/InlineLayout';
import type {
    TabColorVariant,
    TabStyleVariant,
} from '#contexts/tab';
import useSpacingToken from '#hooks/useSpacingToken';

import styles from './styles.module.css';

const colorVariantToClassName: Record<TabColorVariant, string> = {
    text: styles.colorVariantText,
    primary: styles.colorVariantPrimary,
    secondary: styles.colorVariantSecondary,
};

const styleVariantToClassName: Record<TabStyleVariant, string> = {
    tab: styles.styleVariantTab,
    pill: styles.styleVariantPill,
    step: styles.styleVariantStep,
    nav: styles.styleVariantNav,
    vertical: styles.styleVariantVertical,
    'vertical-compact': styles.styleVariantVerticalCompact,
};

export interface Props extends Omit<InlineLayoutProps, 'withPadding'> {
    className?: string;
    tabWrapperClassName?: string;
    children?: React.ReactNode;
    colorVariant?: TabColorVariant;
    styleVariant?: TabStyleVariant;
    withoutPadding?: boolean;
    disabled?: boolean;
    active?: boolean;
    errored?: boolean;

    // FIXME: only for step variant
    stepCompleted?: boolean;
}

function TabLayout(props: Props) {
    const {
        colorVariant = 'primary',
        styleVariant = 'nav',
        spacingOffset = styleVariant === 'tab' ? 1 : 0,
        className,
        disabled,
        children,
        withoutPadding = false,
        active,
        spacing,
        tabWrapperClassName,
        stepCompleted,
        errored,
        ...inlineLayoutProps
    } = props;

    const wrapperSpacingClassName = useSpacingToken({
        modes: ['padding-inline'],
        spacing,
        offset: -5,
    });

    const tabContent = (
        <InlineLayout
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...inlineLayoutProps}
            withPadding={!(withoutPadding || styleVariant === 'vertical-compact' || styleVariant === 'nav')}
            className={_cs(
                styles.tabLayout,
                colorVariantToClassName[colorVariant],
                styleVariantToClassName[styleVariant],
                stepCompleted && styles.completed,
                disabled && styles.disabled,
                active && styles.active,
                // FIXME: implement this
                errored && styles.errored,
                className,
            )}
            spacingOffset={spacingOffset}
        >
            {children}
            <span className={styles.visualFeedback} />
        </InlineLayout>
    );

    if (styleVariant === 'tab') {
        return (
            <div
                className={_cs(
                    styles.tabWrapper,
                    tabWrapperClassName,
                    active && styles.active,
                )}
            >
                <div className={_cs(styles.bottomBorder, wrapperSpacingClassName)} />
                {tabContent}
                <div className={_cs(styles.bottomBorder, wrapperSpacingClassName)} />
                {active && (
                    <div className={styles.activeBorder} />
                )}
            </div>
        );
    }

    if (styleVariant === 'step') {
        return (
            <div
                className={_cs(
                    styles.stepWrapper,
                    active && styles.active,
                )}
                role="tab"
            >
                <div className={styles.dot}>
                    {stepCompleted && (
                        <CheckFillIcon className={styles.icon} />
                    )}
                </div>
                {tabContent}
            </div>
        );
    }

    return tabContent;
}

export default TabLayout;
