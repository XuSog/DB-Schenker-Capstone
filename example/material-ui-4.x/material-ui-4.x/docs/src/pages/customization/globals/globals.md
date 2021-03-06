# Globals

<p class="description">The overrides key enables you to customize the appearance of all instances of a component type, while the props key enables you to change the default value(s) of a component's props.</p>

## CSS

When the configuration variables aren't powerful enough, you can take advantage of the
`overrides` key of the `theme` to potentially change **every single style** injected by Material-UI into the DOM.
That's a really powerful feature.

```js
const theme = createTheme({
  overrides: {
    // Style sheet name ⚛️
    MuiButton: {
      // Name of the rule
      text: {
        // Some CSS
        color: 'white',
      },
    },
  },
});
```

{{"demo": "pages/customization/globals/GlobalCss.js"}}

The list of these customization points for each component is documented under the **Component API** section.
For instance, you can have a look at the [Button](/api/button/#css).
Alternatively, you can always have a look at the [implementation](https://github.com/mui-org/material-ui/blob/v4.x/packages/material-ui/src/Button/Button.js).

## Global CSS

If you are using the [CssBaseline](/components/css-baseline/) component to apply global resets, it can also be used to apply global styles. For instance:

```jsx
const theme = createTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          WebkitFontSmoothing: 'auto',
        },
      },
    },
  },
});

// ...
return (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);
```

## Default props

You can change the default props of all the Material-UI components.
A `props` key is exposed in the `theme` for this use case.

```js
const theme = createTheme({
  props: {
    // Name of the component ⚛️
    MuiButtonBase: {
      // The default props to change
      disableRipple: true, // No more ripple, on the whole application 💣!
    },
  },
});
```

{{"demo": "pages/customization/globals/DefaultProps.js"}}
