import { createContext } from 'react';

export type TabKey = string | number;

export type TabColorVariant = 'primary' | 'secondary' | 'text';
export type TabStyleVariant = 'tab' | 'pill' | 'nav' | 'step' | 'vertical' | 'vertical-compact';

export interface TabContextProps {
    colorVariant: TabColorVariant;
    styleVariant: TabStyleVariant;
    disabled: boolean;
    tabs: TabKey[];
    registerTab: (tab: TabKey) => void;
    unregisterTab: (tab: TabKey) => void;
    activeTab: TabKey | undefined;
    setActiveTab: (key: TabKey) => void;
    step: number | undefined;
    setStep: React.Dispatch<React.SetStateAction<number>>;
}

const TabContext = createContext<TabContextProps>({
    colorVariant: 'primary',
    styleVariant: 'tab',
    disabled: false,
    tabs: [],
    activeTab: undefined,
    step: undefined,

    // eslint-disable-next-line no-console
    setActiveTab: () => { console.warn('TabContext::setActiveTab called before it was initialized'); },
    // eslint-disable-next-line no-console
    registerTab: () => { console.warn('TabContext::registerTab called before it was initialized'); },
    // eslint-disable-next-line no-console
    unregisterTab: () => { console.warn('TabContext::unregisterTab called before it was initialized'); },
    // eslint-disable-next-line no-console
    setStep: () => { console.warn('TabContext::setStep called before it was initialized'); },
});

export default TabContext;
