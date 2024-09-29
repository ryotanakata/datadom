# datadom

**Simple** | **Robust** | **Universal** | **Vanilla-Friendly** | **Prototype-Ready**

A lightweight utility for retrieving DOM elements using custom data attributes.

```html
<main>
  <h1 data-dom="title">Title</h1>
  <p data-dom="text">Text</p>
</main>

<script type="module">
  import { getDataDom } from "@datadomjs/datadom";

  const elements = {
    title: "Title element",
    text: "Text element",
  };

  try {
    const { title, text } = getDataDom(elements);
    console.log(title); // <h1 data-dom="title">Title</h1>
    console.log(text); // <p data-dom="text">Text</p>
  } catch (error) {
    console.error("Error:", error.message);
  }
</script>
```

## Install

### npm

```bash
npm install @datadomjs/datadom
```

### yarn

```bash
yarn add @datadomjs/datadom
```

### pnpm

```bash
pnpm add @datadomjs/datadom
```

### CDN

```html
<script src="https://unpkg.com/@datadomjs/datadom@1.0.2/dist/index.js"></script>
```

## Document

### Argument

| Argument   | Type             | Default | Description                                                                                                              |
| ---------- | ---------------- | ------- | ------------------------------------------------------------------------------------------------------------------------ |
| `elements` | `T`              | -       | An object mapping element keys to their descriptions. Each key corresponds to a `data-dom` attribute value in your HTML. |
| `options`  | `DataDomOptions` | `{}`    | Optional configuration object.                                                                                           |

### Options

| Option              | Type                    | Default                    | Description                                                         |
| ------------------- | ----------------------- | -------------------------- | ------------------------------------------------------------------- |
| `parent`            | `string \| HTMLElement` | `document.documentElement` | The parent element or selector within which to search for elements. |
| `dataAttributeName` | `string`                | `'dom'`                    | The name of the data attribute to use for selecting elements.       |
| `errorThrow`        | `boolean`               | `true`                     | Whether to throw an error when elements are not found.              |

## Example

### Basic

```typescript
const elements = {
  title: "Main title",
  text: "Main text",
};

try {
  const { title, text } = getDataDom(elements);
  console.log(title); // <h1 data-dom="title">Title</h1>
  console.log(text); // <p data-dom="text">Text</p>
} catch (error) {
  console.error("Error:", error.message);
}
```

### Parent Option

```html
<main data-dom-parent="main">
  <h1 data-dom="title">Title</h1>
  <p data-dom="text">Text</p>
</main>
```

```typescript
const elements = {
  title: "Main title",
  text: "Main text",
};

const options = {
  parent: "main",
};

try {
  const { title, text, parent } = getDataDom(elements, options);
  console.log(title); // <h1 data-dom="title">Title</h1>
  console.log(text); // <p data-dom="text">Text</p>
  console.log(parent); // <main data-dom-parent="main"></main>
} catch (error) {
  console.error("Error:", error.message);
}
```

### Data Attribute Option

```html
<main>
  <h1 data-custom-attr="title">Title</h1>
  <p data-custom-attr="text">Text</p>
</main>
```

```typescript
const elements = {
  title: "Main title",
  text: "Main text",
};

const options = {
  dataAttributeName: "custom-attr",
};

try {
  const { title, text } = getDataDom(elements, options);
  console.log(title); // <h1 data-custom-attr="title">Title</h1>
  console.log(text); // <p data-custom-attr="text">Text</p>
} catch (error) {
  console.error("Error:", error.message);
}
```

### Error Throw Option

When errorThrow is set to false, instead of throwing an error, the function will return null and log an error message to the console. This allows the script to continue running even if the element is not found.

```html
<main>
  <h1 data-dom="title">Title</h1>
  <p data-dom="text">Text</p>
</main>
```

```typescript
const elements = {
  title: "Main title",
  text: "Main text",
};

const options = {
  errorThrow: false,
};

const { title, text } = getDataDom(elements, options);
```

### Retrieving Multiple Elements

If there are multiple elements with the same data attribute value, getDataDom will return an array of elements.

```html
<main>
  <p data-dom="texts">text 1</p>
  <p data-dom="texts">text 2</p>
</main>
```

```typescript
const elements = {
  texts: "Texts",
};

try {
  const { texts } = getDataDom(elements);
  console.log(texts);
} catch (error) {
  console.error("Error:", error.message);
}

// [
//   <p data-dom="texts">text 1</p>
//   <p data-dom="texts">text 2</p>
// ]
```

In this example, getDataDom returns an array for the item key because there are multiple elements with data-dom="item".

### TypeScript Support

```typescript
type ElementType = {
  title: string;
  text: string;
};

const elements: ElementType = {
  title: "Main title",
  text: "Main text",
};

try {
  const { title, text } = getDataDom<ElementType>(elements);
  console.log(title); // <h1 data-dom="title">Title</h1>
  console.log(text); // <p data-dom="text">Text</p>
} catch (error) {
  console.error("Error:", error.message);
}
```

### Error Handling

If an element is not found, getDataDom will throw an error. This allows you to handle missing elements gracefully.

```typescript
const elements = {
  nonExistent: "Non-existent element",
};

try {
  const { nonExistent } = getDataDom(elements);
} catch (error) {
  console.error("Error:", error.message);
  // Error: Element "Non-existent element" not found in parent HTML (data-dom="nonExistent")
}
```

In this case, an error is thrown because there are no elements with data-dom="nonExistent".
