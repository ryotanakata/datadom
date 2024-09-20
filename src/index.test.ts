import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getDataDom } from "./index";

describe("getDataDom", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    container.innerHTML = `
      <div data-dom-parent="parent">
        <h1 data-dom="title">Title</h1>
        <p data-dom="text">Text</p>
        <p data-dom="texts">Text 1</p>
        <p data-dom="texts">Text 2</p>
        <p data-dom="texts">Text 3</p>
        <p data-dom="texts">Text 4</p>
      </div>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("should retrieve single elements by data attribute", () => {
    const elements = { title: "Main title", text: "Main text" };
    const { title, text } = getDataDom(elements);

    expect(Array.isArray(title) ? title[0] : title).toBeInstanceOf(HTMLElement);
    expect(
      Array.isArray(title) ? title[0].textContent : title.textContent,
    ).toBe("Title");

    expect(Array.isArray(text) ? text[0] : text).toBeInstanceOf(HTMLElement);
    expect(Array.isArray(text) ? text[0].textContent : text.textContent).toBe(
      "Text",
    );
  });

  it("should retrieve multiple elements as an array", () => {
    const elements = { texts: "Texts" };
    const { texts } = getDataDom(elements);

    if (Array.isArray(texts)) {
      expect(texts).toHaveLength(4);
      texts.forEach((text, index) => {
        expect(text).toBeInstanceOf(HTMLElement);
        expect(text.textContent).toBe(`Text ${index + 1}`);
      });
    } else {
      expect(texts).toBeInstanceOf(HTMLElement);
      expect(texts.textContent).toBe("Text 1");
    }
  });

  it("should use custom parent and data attribute", () => {
    container.innerHTML = `
      <main>
        <h1 data-custom-attr="title">Title</h1>
        <p data-custom-attr="text">Text</p>
      </main>
    `;

    const elements = { title: "Title", text: "Text" };
    const mainElement = document.querySelector("main");

    if (!mainElement) {
      throw new Error("Main element not found");
    }

    const options = {
      parent: mainElement,
      dataAttributeName: "custom-attr",
    };

    const { title, text } = getDataDom(elements, options);

    expect(Array.isArray(title) ? title[0] : title).toBeInstanceOf(HTMLElement);
    expect(
      Array.isArray(title) ? title[0].textContent : title.textContent,
    ).toBe("Title");

    expect(Array.isArray(text) ? text[0] : text).toBeInstanceOf(HTMLElement);
    expect(Array.isArray(text) ? text[0].textContent : text.textContent).toBe(
      "Text",
    );
  });

  it("should throw an error if parent element is not found", () => {
    const elements = { title: "Title element" };

    expect(() => {
      getDataDom(elements, { parent: "nonexistent" });
    }).toThrow("Parent element not found: nonexistent");
  });

  it("should throw an error if child element is not found", () => {
    const elements = { nonExistent: "Non-existent element" };

    expect(() => {
      getDataDom(elements);
    }).toThrow(
      'Element "Non-existent element" not found in parent HTML (data-dom="nonExistent")',
    );
  });

  it("should not throw error when errorThrow is false", () => {
    const elements = { nonExistent: "Non-existent element" };

    const result = getDataDom(elements, { errorThrow: false });

    expect(result.nonExistent).toBeNull();
  });
});
