import {
    _cs,
    isDefined,
} from '@togglecorp/fujs';

import Modal from '#components/Modal';
import useBooleanState from '#hooks/useBooleanState';

import styles from './styles.module.css';

export interface Props {
    className?: string;
    src?: string;
    alt?: string;
    caption?: React.ReactNode;
    captionClassName?: string;
    imgElementClassName?: string;
    withoutCaption?: boolean;
    expandable?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'auto';
    withContainedFit?: boolean;
    withoutBackground?: boolean;
}

function Image(props: Props) {
    const {
        className,
        src,
        alt = '',
        caption,
        imgElementClassName,
        captionClassName,
        withoutCaption = false,
        expandable,
        size = 'auto',
        withContainedFit,
        withoutBackground,
    } = props;

    const [
        isExpanded,
        {
            setTrue: setIsExpandedTrue,
            setFalse: setIsExpandedFalse,
        },
    ] = useBooleanState(false);

    if (!src) {
        return null;
    }

    return (
        <figure
            className={_cs(
                styles.image,
                expandable && styles.expandable,
                size === 'auto' && styles.autoSize,
                size === 'sm' && styles.smallSize,
                size === 'md' && styles.mediumSize,
                size === 'lg' && styles.largeSize,
                withContainedFit && styles.withContainedFit,
                withoutBackground && styles.withoutBackground,
                className,
            )}
            title={withoutCaption && typeof caption === 'string' ? caption : undefined}
        >
            <img
                role="presentation"
                onClick={expandable ? setIsExpandedTrue : undefined}
                src={src}
                alt={alt}
                className={_cs(styles.imgElement, imgElementClassName)}
            />
            {!withoutCaption && isDefined(caption) && (
                <figcaption className={_cs(captionClassName, styles.caption)}>
                    {caption}
                </figcaption>
            )}
            {isExpanded && (
                <Modal
                    className={styles.expandedModal}
                    size="full"
                    heading={caption}
                    headingLevel={5}
                    onClose={setIsExpandedFalse}
                >
                    <img
                        className={_cs(styles.imgElement)}
                        src={src}
                        alt={alt}
                    />
                </Modal>
            )}
        </figure>
    );
}

export default Image;
