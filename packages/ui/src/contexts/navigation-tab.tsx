import { createContext } from 'react';

import {
    TabColorVariant,
    TabStyleVariant,
} from '#contexts/tab';

export interface NavigationTabContextProps {
    colorVariant?: TabColorVariant;
    styleVariant?: TabStyleVariant;
    className?: string;
}

const NavigationTabContext = createContext<NavigationTabContextProps>({
    colorVariant: 'primary',
    styleVariant: 'tab',
});

export default NavigationTabContext;
