var task = require('../index.js');

CocktailOfTasks.dir.assets = 'src/';
CocktailOfTasks.dir.public = 'dist/';

task(function(mix) {
    mix

    // SCSS
        .scss({
            from: "scss/test_scss.scss",
            to: "css/",
            source_map: true,
            includePaths: [
                '../node_modules/compass-mixins/lib/',
            ]
        })
        .scss({
            from: "scss/test_sprite.scss",
            to: "css/",
            source_map: false,
            includePaths: [
                '../node_modules/compass-mixins/lib/',
            ]
        })

        // WEBPACK
        .webpack({
            from: "js/webpack.js",
            to: "js/",
            source_map: true
        })

        // COPY
        .copy({
            "src": "src/css/copy.css",
            "to": "css/"
        })
        .copy([
            {
                src: "src/css/be_new_copy.css",
                to: "css/new_copy.css",
                min: true
            },
            {
                name: "cp",
                src: [
                    "src/js/copy1.js",
                    "src/js/copy2.js",
                ],
                to: "js/copy12/"
            }
        ])

        // SCRIPTS
        .scripts({
            to: "js/scripts.js",
            source_map: true,
            src: [
                "src/js/copy1.js",
                "src/js/copy2.js",
            ]
        })

        // STYLES
        .styles({
            to: "css/styles.css",
            source_map: true,
            src: [
                "src/css/be_new_copy.css",
                "src/css/copy.css",
            ]
        })

        // SPRITE
        .sprite({
            to: {
                images: "images/",
                css: "json/"
            },
            css: {
                extension: "json",
                format: "json_texture"
            },
            sprites: {
                "auth_test": "images/auth/*.png",
                "watch": "images/watch/*.jpg",
            }
        })

        // SPRITE
        .compress({
            to: "images/compresso/",
            images: [
                {from: "auth/*.png", to: "auth/"},
                "watch/*.jpg"
            ]
        })
    ;
});
