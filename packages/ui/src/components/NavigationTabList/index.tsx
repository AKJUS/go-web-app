import { useMemo } from 'react';

import TabListLayout, { type Props as TabListLayoutProps } from '#components/TabListLayout';
import NavigationTabContext from '#contexts/navigation-tab';
import {
    TabColorVariant,
    TabStyleVariant,
} from '#contexts/tab';

export interface Props extends TabListLayoutProps {
    colorVariant?: TabColorVariant;
    styleVariant?: TabStyleVariant;
    disabled?: boolean;
}

export default function NavigationTabList(props: Props) {
    const {
        styleVariant = 'tab',
        colorVariant = styleVariant === 'tab' ? 'text' : 'primary',
        disabled,
        ...tabListLayoutProps
    } = props;

    const tabContextValue = useMemo(
        () => ({
            colorVariant,
            styleVariant,
            disabled,
        }),
        [styleVariant, colorVariant, disabled],
    );

    return (
        <NavigationTabContext.Provider value={tabContextValue}>
            <TabListLayout
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...tabListLayoutProps}
                styleVariant={styleVariant}
                colorVariant={colorVariant}
                disabled={disabled}
            />
        </NavigationTabContext.Provider>
    );
}
