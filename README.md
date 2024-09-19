# datadom

**Simple** | **Robust** | **Universal** | **Vanilla-Friendly** | **Prototype-Ready**

A lightweight utility for retrieving DOM elements using custom data attributes.

```html
<main>
  <h1 data-dom="title">Title</h1>
  <p data-dom="text">Text</p>
</main>

<script type="module">
  import { getDataDom } from "datadom";

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

```bash
npm install datadom
```

## Document

| Argument            | Type                    | Default                    | Description                                                                                                              |
| ------------------- | ----------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `dataDoms`          | `Object`                | -                          | An object mapping element keys to their descriptions. Each key corresponds to a `data-dom` attribute value in your HTML. |
| `parent`            | `string \| HTMLElement` | `document.documentElement` | The parent element or selector within which to search for elements. If a string is provided, it's used as a selector.    |
| `dataAttributeName` | `string`                | `'dom'`                    | The name of the data attribute to use for selecting elements. By default, it uses `data-dom`.                            |

## Example

### Basic

```typescript
const elements = {
  title: "Title element",
  content: "Content element",
};

const { title, content } = getDataDom(elements);

console.log(title); // <h1 data-dom="title">Title</h1>
console.log(content); // <p data-dom="content">Content</p>
```

### Using a Custom Parent and Data Attribute

```html
<main>
  <div data-custom-attr="header">Header</div>
  <div data-custom-attr="footer">Footer</div>
</main>
```

```typescript
const { header, footer } = getDataDom(
  { header: "Header", footer: "Footer" },
  document.querySelector("main"),
  "custom-attr"
);

console.log(header); // <div data-custom-attr="header">Header</div>
console.log(footer); // <div data-custom-attr="footer">Footer</div>
```

### Retrieving Multiple Elements

If there are multiple elements with the same data attribute value, getDataDom will return an array of elements.

```html
<main>
  <p data-dom="item">Item 1</p>
  <p data-dom="item">Item 2</p>
</main>
```

```typescript
const elements = {
  item: "Items",
};

const { item } = getDataDom(elements);

console.log(item);
// [
//   <p data-dom="item">Item 1</p>,
//   <p data-dom="item">Item 2</p>
// ]
```

In this example, getDataDom returns an array for the item key because there are multiple elements with data-dom="item".

### Error Handling

If an element is not found, getDataDom will throw an error. This allows you to handle missing elements gracefully.

```typescript
try {
  const { nonExistent } = getDataDom({ nonExistent: "Non-existent element" });
} catch (error) {
  console.error("Error:", error.message); // Error: Element "Non-existent element" not found (data-dom="nonExistent")
}
```

In this case, an error is thrown because there are no elements with data-dom="nonExistent".
