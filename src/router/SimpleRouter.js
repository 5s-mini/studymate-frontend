import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';

const RouterContext = createContext({
    pathname: '/',
    navigate: () => {}
});

const RouteParamsContext = createContext({});

const getInitialPathname = () => {
    if (typeof window === 'undefined' || !window.location) {
        return '/';
    }

    return window.location.pathname || '/';
};

const compilePath = pattern => {
    if (pattern === '*') {
        return {
            regex: /^.*$/,
            keys: []
        };
    }

    const segments = pattern
        .split('/')
        .filter(Boolean);

    const keys = [];
    const regexSegments = segments.map(segment => {
        if (segment.startsWith(':')) {
            keys.push(segment.slice(1));
            return '([^/]+)';
        }

        return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    });

    const regexBody = regexSegments.length ? `/${regexSegments.join('/')}` : '/';
    const regex = new RegExp(`^${regexBody}/?$`);
    return { regex, keys };
};

const matchPath = (pattern, pathname) => {
    if (!pattern) {
        return null;
    }

    const { regex, keys } = compilePath(pattern);
    const match = pathname.match(regex);

    if (!match) {
        return null;
    }

    const params = keys.reduce((acc, key, index) => {
        acc[key] = match[index + 1];
        return acc;
    }, {});

    return { params };
};

export function BrowserRouter({ children }) {
    const [pathname, setPathname] = useState(getInitialPathname);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return () => {};
        }

        const handlePopState = () => {
            setPathname(window.location.pathname || '/');
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const navigate = useCallback(
        to => {
            if (typeof window !== 'undefined' && window.history) {
                window.history.pushState({}, '', to);
            }

            setPathname(to);
        },
        []
    );

    const contextValue = useMemo(
        () => ({
            pathname,
            navigate
        }),
        [pathname, navigate]
    );

    return (
        <RouterContext.Provider value={contextValue}>
            {children}
        </RouterContext.Provider>
    );
}

export function Routes({ children }) {
    const { pathname } = useContext(RouterContext);
    let elementToRender = null;

    React.Children.forEach(children, child => {
        if (!React.isValidElement(child) || elementToRender) {
            return;
        }

        const { path, element } = child.props;
        const match = matchPath(path, pathname);

        if (match) {
            elementToRender = (
                <RouteParamsContext.Provider value={match.params}>
                    {element}
                </RouteParamsContext.Provider>
            );
        }
    });

    return elementToRender;
}

export function Route() {
    return null;
}

export function Link({ to, children, onClick, ...rest }) {
    const { navigate } = useContext(RouterContext);

    const handleClick = event => {
        if (onClick) {
            onClick(event);
        }

        if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.altKey ||
            event.ctrlKey ||
            event.shiftKey
        ) {
            return;
        }

        event.preventDefault();
        navigate(to);
    };

    return (
        <a href={to} onClick={handleClick} {...rest}>
            {children}
        </a>
    );
}

export function useNavigate() {
    const { navigate } = useContext(RouterContext);
    return navigate;
}

export function useParams() {
    return useContext(RouteParamsContext);
}