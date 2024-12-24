import {
    useContext,
    useMemo,
    useState,
} from 'react';
import { LanguageContext } from '@ifrc-go/ui/contexts';
import { MapLayer } from '@togglecorp/re-map';
import {
    type Expression,
    type FillLayer,
    type FillPaint,
    type LineLayer,
    type LngLatLike,
    type MapboxGeoJSONFeature,
    type SymbolLayer,
} from 'mapbox-gl';

import BaseMap, { type Props as BaseMapProps } from '#components/domain/BaseMap';
import {
    COLOR_BLACK,
    type CountryRecordTypeEnum,
} from '#utils/constants';

export interface AdminZeroFeatureProperties {
    country_id: number;
    disputed: boolean;
    independent: boolean;
    is_deprecated: boolean;
    name: string;
    name_ar: string;
    name_es: string;
    name_fr: string;
    record_type: CountryRecordTypeEnum;

    // NOTE: we check for undefined iso3 before triggering
    // onClick and onHover
    iso3: string;

    fdrs?: string;
    iso?: string;
    region_id?: number;
}

const KOSOVO_ISO3 = 'XKX';
const WESTERN_SAHARA_ISO3 = 'ESH';

const overlappedDisputedCountriesIso3 = [
    KOSOVO_ISO3,
    WESTERN_SAHARA_ISO3,
];

const adminZeroHighlightPaint: FillPaint = {
    'fill-color': COLOR_BLACK,
    'fill-opacity': [
        'case',
        ['all',
            ['==', ['feature-state', 'hovered'], true],
            ['!=', ['get', 'iso3'], null],
        ],
        0.2,
        0,
    ],
};

interface Props extends Omit<BaseMapProps, 'baseLayers'> {
    onHover?: (hoveredFeatureProperties: AdminZeroFeatureProperties | undefined) => void;
    onClick?: (
        clickedFeatureProperties: AdminZeroFeatureProperties,
        lngLat: LngLatLike,
    ) => void;
    activeCountryIso3?: string | undefined | null;
}

function GlobalMap(props: Props) {
    const {
        onHover,
        onClick,
        ...baseMapProps
    } = props;

    const [hoveredCountryIso3, setHoverdCountryIso3] = useState<string | undefined>();

    const handleFeatureMouseEnter = (feature: MapboxGeoJSONFeature) => {
        const hoveredFeatureProperties = feature.properties as (
            AdminZeroFeatureProperties | undefined
        );

        setHoverdCountryIso3(hoveredFeatureProperties?.iso3);

        if (onHover) {
            onHover(hoveredFeatureProperties);
        }
    };

    const handleFeatureMouseLeave = () => {
        setHoverdCountryIso3(undefined);

        if (onHover) {
            onHover(undefined);
        }
    };

    const handleClick = (feature: MapboxGeoJSONFeature, lngLat: LngLatLike) => {
        if (onClick) {
            onClick(
                feature.properties as AdminZeroFeatureProperties,
                lngLat,
            );
        }

        return true;
    };

    const fillSortKey = useMemo<number | Expression>(() => [
        'match',
        ['get', 'iso3'],
        hoveredCountryIso3 ?? '???',
        2,
        ...(overlappedDisputedCountriesIso3.filter(
            (iso3) => !(iso3 === hoveredCountryIso3),
        ).flatMap((iso3) => [iso3, 1])),
        0,
    ], [hoveredCountryIso3]);

    const adminZeroHighlightLayerOptions = useMemo<Omit<FillLayer, 'id'>>(
        () => ({
            type: 'fill',
            layout: {
                visibility: 'visible',
                'fill-sort-key': fillSortKey,
            },
            paint: adminZeroHighlightPaint,
            filter: ['!=', ['get', 'iso3'], null],
        }),
        [fillSortKey],
    );

    const adminZeroBaseLayerOptions = useMemo<Omit<FillLayer, 'id'>>(
        () => ({
            type: 'fill',
            layout: {
                visibility: 'visible',
                'fill-sort-key': fillSortKey,
            },
        }),
        [fillSortKey],
    );

    const adminZeroLineLayerOptions = useMemo<Omit<LineLayer, 'id'>>(
        () => ({
            type: 'line',
            layout: {
                visibility: 'visible',
            },
        }),
        [],
    );

    const { currentLanguage } = useContext(LanguageContext);

    const adminLabelLayerOptions : Omit<SymbolLayer, 'id'> = useMemo(
        () => {
            // ar, es, fr
            let label: string;
            if (currentLanguage === 'es') {
                label = 'name_es';
            } else if (currentLanguage === 'ar') {
                label = 'name_ar';
            } else if (currentLanguage === 'fr') {
                label = 'name_fr';
            } else {
                label = 'name';
            }

            return {
                type: 'symbol',
                layout: {
                    'text-field': ['get', label],
                    visibility: 'visible',
                },
            };
        },
        [currentLanguage],
    );

    return (
        <BaseMap
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...baseMapProps}
            withoutLabel
            baseLayers={(
                <>
                    <MapLayer
                        layerKey="admin-0"
                        layerOptions={adminZeroBaseLayerOptions}
                        onMouseEnter={handleFeatureMouseEnter}
                        onMouseLeave={handleFeatureMouseLeave}
                    />
                    <MapLayer
                        layerKey="admin-0-label"
                        layerOptions={adminLabelLayerOptions}
                    />
                    <MapLayer
                        layerKey="admin-0-label-non-independent"
                        layerOptions={adminLabelLayerOptions}
                    />
                    <MapLayer
                        layerKey="admin-0-label-priority"
                        layerOptions={adminLabelLayerOptions}
                    />
                    <MapLayer
                        layerKey="admin-0-boundary-mask"
                        layerOptions={adminZeroLineLayerOptions}
                    />
                    <MapLayer
                        layerKey="admin-0-boundary-disputed"
                        layerOptions={adminZeroLineLayerOptions}
                    />
                    {(onHover || onClick) && (
                        <MapLayer
                            layerKey="admin-0-highlight"
                            layerOptions={adminZeroHighlightLayerOptions}
                            onClick={onClick ? handleClick : undefined}
                        />
                    )}
                    {/*
                    <MapLayer
                        layerKey="admin-0-boundary"
                        layerOptions={adminZeroLineLayerOptions}
                    />
                    */}
                </>
            )}
        />
    );
}

export default GlobalMap;
