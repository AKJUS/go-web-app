import { useContext } from 'react';
import { isNotDefined } from '@togglecorp/fujs';

import RouteContext from '#contexts/route';
import useAuth from '#hooks/domain/useAuth';
import usePermissions from '#hooks/domain/usePermissions';
import { type WrappedRoutes } from '#routes';
import {
    resolvePath,
    type UrlParams,
} from '#utils/domain/link';

interface ExternalLinkProps {
    external: true,
    href: string | undefined | null,
    to?: never,
    urlParams?: never,
}

interface InternalLinkProps {
    external: false | undefined,
    to: keyof WrappedRoutes | undefined | null,
    urlParams?: UrlParams,
    href?: never,
}

function useLink(props: InternalLinkProps | ExternalLinkProps) {
    const { isAuthenticated } = useAuth();
    const routes = useContext(RouteContext);
    const perms = usePermissions();

    const {
        external,
        href,
        to,
        urlParams,
    } = props;

    if (external) {
        if (isNotDefined(href)) {
            return { disabled: true, to: undefined };
        }
        return { disabled: false, to: href };
    }

    if (isNotDefined(to)) {
        return { disabled: true, to: undefined };
    }

    const route = resolvePath(to, routes, urlParams);
    const { resolvedPath } = route;

    if (isNotDefined(resolvedPath)) {
        return { disabled: true, to: undefined };
    }

    const disabled = (route.visibility === 'is-authenticated' && !isAuthenticated)
        || (route.visibility === 'is-not-authenticated' && isAuthenticated)
        || (route.permissions && !route.permissions(perms, urlParams));

    return {
        disabled,
        to: resolvedPath,
    };
}

export default useLink;
