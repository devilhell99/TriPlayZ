# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install
```

## Development Server

Start the development server on http://localhost:3000

```bash
yarn run dev
```

## Production

Build the application for production:

```bash
yarn run build
```

Locally preview production build:

```bash
yarn run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Features

Use Fetch

- All fetch options can be given a computed or ref value. These will be watched and new requests made automatically with any new values if they are updated.
- doc https://nuxt.com/docs/api/composables/use-fetch
- issue https://github.com/nuxt/nuxt/issues/15741
- solution clone variable reactive, ref to new variable

- refresh useEffect not use

CSS

- overwrite element-ui
  - https://element-plus.org/en-US/guide/theming.html#by-scss-variables
  - @forward 'element-plus/theme-chalk/src/common/var.scss' with (...)
- reuse class taiwincss in custom class
  - @apply relative rounded-[20px] py-[10px] px-[16px] tracking-widest leading-4 text-sm #{!important};
    &--large {...)
# TriPlayZ
