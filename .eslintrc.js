module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "amd": true,
        "node": true,
        "mocha": true
    },
    "extends": ["eslint:recommended"],
    
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
        },
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
    }
};