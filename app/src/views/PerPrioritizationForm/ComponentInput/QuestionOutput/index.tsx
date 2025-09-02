import {
    Description,
    InlineLayout,
    Label,
    ListView,
} from '@ifrc-go/ui';
import { isNotDefined } from '@togglecorp/fujs';

interface Props {
    question: string | undefined | null;
    answer: string | undefined | null;
    // FIXME: Check why question number and even question can be undefined
    questionNum: number | undefined | null;
    componentNum: number;
    notes?: string | null;
    withDarkBackground?: boolean;
}

function QuestionOutput(props: Props) {
    const {
        questionNum,
        componentNum,
        question,
        answer,
        notes,
        withDarkBackground,
    } = props;

    if (isNotDefined(questionNum)) {
        return null;
    }

    return (
        <ListView
            layout="block"
            withSpacingOpticalCorrection
            withPadding
            withDarkBackground={withDarkBackground}
            spacing="sm"
        >
            <InlineLayout
                before={`${componentNum}.${questionNum}.`}
                after={(
                    <Label strong>
                        {answer}
                    </Label>
                )}
            >
                {question}
            </InlineLayout>
            {notes && (
                <Description withLightText>
                    {notes}
                </Description>
            )}
        </ListView>
    );
}

export default QuestionOutput;
