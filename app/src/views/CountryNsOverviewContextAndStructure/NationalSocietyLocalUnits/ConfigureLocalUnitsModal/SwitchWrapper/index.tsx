import {
    Switch,
    type SwitchProps,
} from '@ifrc-go/ui';

export interface Props extends SwitchProps<number> {
    formId: number;
}

function SwitchWrapper(props: Props) {
    const { formId, ...otherProps } = props;
    return (
        <Switch
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...otherProps}
            name={formId}
        />
    );
}
export default SwitchWrapper;
