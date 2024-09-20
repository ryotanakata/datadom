/**
 * Mapping of element names to their descriptions for custom data attributes
 */
type Elements = {
  [key: string]: string;
};

/**
 * Return type for the getDataDom function
 */
type DataDomResult<T extends Elements> = {
  parent: HTMLElement;
} & {
  [K in keyof T]: HTMLElement | HTMLElement[];
};

/**
 * Options for selecting parent element, custom data attribute, and error handling in getDataDom function
 */
type DataDomOptions = {
  parent?: string | HTMLElement;
  dataAttributeName?: string;
  errorThrow?: boolean;
};

/**
 * Retrieves child elements with specified custom data attributes from a given parent element or selector
 *
 * @template T - The mapping of element names to their descriptions for custom data attributes
 * @param {T} elements - Object containing variable names and data attribute names of elements to retrieve
 * @param {DataDomOptions} options - Options for selecting parent element, custom data attribute, and error handling
 * @returns {DataDomResult<T>} Object containing the parent element and retrieved elements
 * @throws {Error} If the parent element or specified child elements are not found
 *
 * @example
 * <main>
 *   <h1 data-dom="title">Title</h1>
 *   <p data-dom="text">Text</p>
 * </main>
 *
 * const elements = {
 *   title: 'Main title',
 *   text: 'Main text',
 * };
 *
 * try {
 *   const { title, text } = getDataDom(elements);
 * } catch (e) {
 *   console.error(e);
 * }
 */
const getDataDom = <T extends Elements = Record<string, never>>(
  elements: T = {} as T,
  options: DataDomOptions = {},
): DataDomResult<T> => {
  const {
    parent = document.documentElement,
    dataAttributeName = "dom",
    errorThrow = true,
  } = options;

  /**
   * Retrieves the parent element from the DOM based on a selector or HTMLElement.
   * Throws an error or logs a message if the element is not found, depending on the errorThrow option.
   *
   * @param {string | HTMLElement} parent - The parent element selector or direct HTMLElement.
   * @returns {HTMLElement | null} The parent element or null if not found.
   * @throws {Error} If the parent element is not found and errorThrow is true.
   */
  const getParentDom = (parent: string | HTMLElement): HTMLElement | null => {
    if (parent instanceof HTMLElement) {
      return parent;
    }

    const element = document.querySelector(
      parent.startsWith("[") || parent.startsWith(".") || parent.startsWith("#")
        ? parent
        : `[data-dom-parent="${parent}"]`,
    );

    if (!element) {
      const messages = `Parent element not found: ${parent}`;

      if (errorThrow) {
        throw new Error(messages);
      } else {
        // eslint-disable-next-line no-console
        console.error(messages);
        return null;
      }
    }

    return element as HTMLElement;
  };

  /**
   * Retrieves child elements matching the specified custom data attribute from the parent element.
   * Returns an array if multiple elements are found or a single element if only one exists.
   *
   * @param {string} key - The custom data attribute value.
   * @param {string} name - The description or name of the element (used in error messages).
   * @returns {HTMLElement | HTMLElement[] | null} The found element(s), or null if none are found.
   * @throws {Error} If no elements are found and errorThrow is true.
   */
  const getDataDomByKeyName = (
    key: string,
    name: string,
  ): HTMLElement | HTMLElement[] | null => {
    if (!parentDom) return null;

    const dataDoms = Array.from(
      parentDom.querySelectorAll(`[data-${dataAttributeName}="${key}"]`),
    ) as HTMLElement[];

    if (dataDoms.length === 0) {
      const messages = `Element "${name}" not found in parent ${parentDom.tagName} (data-${dataAttributeName}="${key}")`;

      if (errorThrow) {
        throw new Error(messages);
      } else {
        // eslint-disable-next-line no-console
        console.error(messages);
        return null;
      }
    }

    return dataDoms.length === 1 ? dataDoms[0] : dataDoms;
  };

  const parentDom = getParentDom(parent);

  if (!parentDom) {
    return {} as DataDomResult<T>;
  }

  const dataDoms = Object.entries(elements).reduce<Partial<DataDomResult<T>>>(
    (acc, [key, name]) => {
      acc[key as keyof T] = getDataDomByKeyName(
        key,
        name,
      ) as DataDomResult<T>[keyof T];
      return acc;
    },
    {},
  );

  return { parent: parentDom, ...dataDoms } as DataDomResult<T>;
};

export { getDataDom };
