const path = require("path")

module.exports = (baseCfg, type, cfg) => {
    cfg.module.rules.push({
        test: /\.sass|.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
        include: [
            path.resolve(__dirname, "../stories")
        ]
    })
    cfg.resolve.extensions.push('.sass')
    return cfg
}
