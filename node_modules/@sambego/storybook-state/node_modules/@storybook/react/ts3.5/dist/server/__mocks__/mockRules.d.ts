declare const _default: ({
    parser: {
        requireEnsure: boolean;
    };
    test?: undefined;
    enforce?: undefined;
    use?: undefined;
    include?: undefined;
    oneOf?: undefined;
} | {
    test: RegExp;
    enforce: string;
    use: {
        options: {
            formatter: string;
            eslintPath: string;
            baseConfig: {
                extends: string[];
            };
            ignore: boolean;
            useEslintrc: boolean;
        };
        loader: string;
    }[];
    include: string;
    parser?: undefined;
    oneOf?: undefined;
} | {
    oneOf: ({
        test: RegExp[];
        loader: string;
        options: {
            limit: number;
            name: string;
            customize?: undefined;
            babelrc?: undefined;
            configFile?: undefined;
            presets?: undefined;
            cacheIdentifier?: undefined;
            plugins?: undefined;
            cacheDirectory?: undefined;
            cacheCompression?: undefined;
            compact?: undefined;
            sourceMaps?: undefined;
        };
        include?: undefined;
        exclude?: undefined;
        use?: undefined;
        sideEffects?: undefined;
    } | {
        test: RegExp;
        include: string;
        loader: string;
        options: {
            customize: string;
            babelrc: boolean;
            configFile: boolean;
            presets: string[];
            cacheIdentifier: string;
            plugins: (string | {
                loaderMap: {
                    svg: {
                        ReactComponent: string;
                    };
                };
            })[][];
            cacheDirectory: boolean;
            cacheCompression: boolean;
            compact: boolean;
            limit?: undefined;
            name?: undefined;
            sourceMaps?: undefined;
        };
        exclude?: undefined;
        use?: undefined;
        sideEffects?: undefined;
    } | {
        test: RegExp;
        exclude: {};
        loader: string;
        options: {
            babelrc: boolean;
            configFile: boolean;
            compact: boolean;
            presets: (string | {
                helpers: boolean;
            })[][];
            cacheDirectory: boolean;
            cacheCompression: boolean;
            cacheIdentifier: string;
            sourceMaps: boolean;
            limit?: undefined;
            name?: undefined;
            customize?: undefined;
            plugins?: undefined;
        };
        include?: undefined;
        use?: undefined;
        sideEffects?: undefined;
    } | {
        test: RegExp;
        exclude: {};
        use: (string | {
            loader: string;
            options: {
                importLoaders: number;
                sourceMap: boolean;
                ident?: undefined;
            };
        } | {
            loader: string;
            options: {
                ident: string;
                sourceMap: boolean;
                importLoaders?: undefined;
            };
        } | {
            loader: string;
            options: {
                sourceMap: boolean;
                importLoaders?: undefined;
                ident?: undefined;
            };
        })[];
        sideEffects: boolean;
        loader?: undefined;
        options?: undefined;
        include?: undefined;
    } | {
        test: RegExp;
        use: (string | {
            loader: string;
            options: {
                importLoaders: number;
                sourceMap: boolean;
                modules: boolean;
                ident?: undefined;
            };
        } | {
            loader: string;
            options: {
                ident: string;
                sourceMap: boolean;
                importLoaders?: undefined;
                modules?: undefined;
            };
        } | {
            loader: string;
            options: {
                sourceMap: boolean;
                importLoaders?: undefined;
                modules?: undefined;
                ident?: undefined;
            };
        })[];
        loader?: undefined;
        options?: undefined;
        include?: undefined;
        exclude?: undefined;
        sideEffects?: undefined;
    } | {
        loader: string;
        exclude: {}[];
        options: {
            name: string;
            limit?: undefined;
            customize?: undefined;
            babelrc?: undefined;
            configFile?: undefined;
            presets?: undefined;
            cacheIdentifier?: undefined;
            plugins?: undefined;
            cacheDirectory?: undefined;
            cacheCompression?: undefined;
            compact?: undefined;
            sourceMaps?: undefined;
        };
        test?: undefined;
        include?: undefined;
        use?: undefined;
        sideEffects?: undefined;
    })[];
    parser?: undefined;
    test?: undefined;
    enforce?: undefined;
    use?: undefined;
    include?: undefined;
})[];
export default _default;
