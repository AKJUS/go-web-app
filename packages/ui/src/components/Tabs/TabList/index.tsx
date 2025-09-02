import React from 'react';

import TabListLayout, { type Props as TabListLayoutProps } from '#components/TabListLayout';
import TabContext from '#contexts/tab';

export default function TabList(props: TabListLayoutProps) {
    const context = React.useContext(TabContext);

    const {
        colorVariant,
        styleVariant,
        disabled,
    } = context;

    return (
        <TabListLayout
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            styleVariant={styleVariant}
            colorVariant={colorVariant}
            disabled={disabled}
        />
    );
}
