declare class BaseTestPlugin1 {
}
declare class BaseTestPlugin2 {
}
declare const _default: {
    devtool: string;
    resolve: {
        extensions: string[];
        alias: {
            baseAlias: string;
        };
        modules: any[];
    };
    module: {
        noParse: RegExp;
        rules: {
            test: RegExp;
            include: string;
            loader: string;
            options: {};
        }[];
    };
    plugins: (BaseTestPlugin1 | BaseTestPlugin2)[];
};
export default _default;
