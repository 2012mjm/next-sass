# Next.js + Sass

Import `.sass` or `.scss` files in your Next.js project

Notice: this library supports simultaneously the Sass modules and Sass, it also has the ability to chunk css files for each components.

## Installation

```
npm install --save @2012mjm/next-sass node-sass
```

or

```
yarn add @2012mjm/next-sass node-sass
```

## Usage

The stylesheet is compiled to `.next/static/css`. Next.js will automatically add the css file to the HTML. 
In production a chunk hash is added so that styles are updated when a new version of the stylesheet is deployed.

### Config

Create a `next.config.js` in your project

```js
// next.config.js
const withSass = require('@2012mjm/next-sass')
module.exports = withSass({
  /* config options here */
})
```

Create a Sass file `styles.scss`, this is without Sass modules

```scss
$font-size: 50px;
.example {
  font-size: $font-size;
}
```

And use the `module.scss` extension for the Sass module, for example: `styles.module.scss`

Create a page file `pages/index.js`

```js
import "../styles.scss"

export default () => <div className="example">Hello World!</div>
```

And use this for Sass module

```js
import styles from "../styles.module.scss"

export default () => <div className={styles.example}>Hello World!</div>
```

### With options

You can also pass a list of options to the `css-loader` by passing an object called `cssLoaderOptions`.

For instance, [to enable locally scoped CSS modules](https://github.com/css-modules/css-modules/blob/master/docs/local-scope.md#css-modules--local-scope), you can write:

```js
// next.config.js
const withSass = require('@2012mjm/next-sass')
module.exports = withSass({
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[local]___[hash:base64:5]",
  }
})
```

### Extract css initialize

```js
// next.config.js
const withSass = require('@2012mjm/next-sass')

module.exports = withSass({
  cssExtractOutput: {
    filename: {
      dev: 'static/css/[name].css',
      prod: 'static/css/[contenthash:8].css'
    },
    chunkFilename: {
      dev: 'static/css/[name].chunk.css',
      prod: 'static/css/[contenthash:16].css'
    }
  }
})
```

Your exported HTML will then reflect locally scoped CSS class names.

For a list of supported options, [refer to the webpack `css-loader` README](https://github.com/webpack-contrib/css-loader#options).

### With SASS loader options

You can pass options from [node-sass](https://github.com/sass/node-sass#options)

```js
// next.config.js
const withSass = require('@2012mjm/next-sass')
module.exports = withSass({
  sassLoaderOptions: {
    includePaths: ["absolute/path/a", "absolute/path/b"]
  }
})
```

### PostCSS plugins

Create a `next.config.js` in your project

```js
// next.config.js
const withSass = require('@2012mjm/next-sass')
module.exports = withSass({
  /* config options here */
})
```

Create a `postcss.config.js`

```js
module.exports = {
  plugins: {
    // Illustrational
    'postcss-css-variables': {}
  }
}
```

Create a CSS file `styles.scss` the CSS here is using the css-variables postcss plugin.

```css
:root {
  --some-color: red;
}

.example {
  /* red */
  color: var(--some-color);
}
```

When `postcss.config.js` is not found `postcss-loader` will not be added and will not cause overhead.

You can also pass a list of options to the `postcss-loader` by passing an object called `postcssLoaderOptions`.

For example, to pass theme env variables to postcss-loader, you can write:

```js
// next.config.js
const withSass = require('@2012mjm/next-sass')
module.exports = withSass({
  postcssLoaderOptions: {
    parser: true,
    config: {
      ctx: {
        theme: JSON.stringify(process.env.REACT_APP_THEME)
      }
    }
  }
})
```

### Configuring Next.js

Optionally you can add your custom Next.js configuration as parameter

```js
// next.config.js
const withSass = require('@2012mjm/next-sass')
module.exports = withSass({
  webpack(config, options) {
    return config
  }
})
```