import { describe, it, expect, beforeEach } from "vitest";
import { getDataDom } from "./index";

describe("getDataDom", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    container.innerHTML = `
      <div data-dom-parent="parent">
        <h1 data-dom="title">Title</h1>
        <p data-dom="text">Text</p>
        <div data-dom="item">Item 1</div>
        <div data-dom="item">Item 2</div>
      </div>
    `;
    document.body.appendChild(container);
  });

  it("should retrieve single elements by data attribute", () => {
    const elements = { title: "Title element", text: "Text element" };
    const { title, text } = getDataDom(elements, "parent");

    if (!Array.isArray(title) && !Array.isArray(text)) {
      expect(title).toBeInstanceOf(HTMLElement);
      expect(title.textContent).toBe("Title");

      expect(text).toBeInstanceOf(HTMLElement);
      expect(text.textContent).toBe("Text");
    } else {
      throw new Error("Expected single HTMLElement, but received an array");
    }
  });

  it("should retrieve multiple elements as an array", () => {
    const elements = { item: "Item elements" };
    const { item } = getDataDom(elements, "parent");

    expect(Array.isArray(item)).toBe(true);
    expect(item).toHaveLength(2);
    expect(item[0].textContent).toBe("Item 1");
    expect(item[1].textContent).toBe("Item 2");
  });

  it("should throw an error if parent element is not found", () => {
    const elements = { title: "Title element" };

    expect(() => {
      getDataDom(elements, "nonexistent");
    }).toThrow("Parent element not found: nonexistent");
  });

  it("should throw an error if child element is not found", () => {
    const elements = { nonexistent: "Nonexistent element" };

    expect(() => {
      getDataDom(elements, "parent");
    }).toThrow(
      'Element "Nonexistent element" not found (data-dom="nonexistent")',
    );
  });
});
