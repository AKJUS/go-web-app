import {
    Container,
    ListView,
} from '@ifrc-go/ui';

interface Props {
    heading: React.ReactNode;
    children: React.ReactNode;
}

function SurgeCardContainer(props: Props) {
    const {
        heading,
        children,
    } = props;

    return (
        <Container
            heading={heading}
            withHeaderBorder
            withoutSpacingOpticalCorrection
        >
            <ListView
                layout="grid"
                numPreferredGridColumns={3}
                minGridColumnSize="16rem"
            >
                {children}
            </ListView>
        </Container>
    );
}

export default SurgeCardContainer;
