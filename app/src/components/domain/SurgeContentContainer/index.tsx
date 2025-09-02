import {
    Container,
    ListView,
} from '@ifrc-go/ui';

interface Props {
    heading: React.ReactNode;
    children: React.ReactNode;
}

function SurgeContentContainer(props: Props) {
    const {
        heading,
        children,
    } = props;

    return (
        <Container
            heading={heading}
            withHeaderBorder
        >
            <ListView
                layout="block"
                spacing="lg"
            >
                {children}
            </ListView>
        </Container>
    );
}

export default SurgeContentContainer;
