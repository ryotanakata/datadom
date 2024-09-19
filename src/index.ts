/**
 * Mapping of element names to their descriptions for custom data attributes
 */
type DataDoms = {
  [key: string]: string;
};

/**
 * Return type for the getDataDom function
 */
type GetDataDomResult<T extends DataDoms> = {
  parent: HTMLElement;
} & {
  [K in keyof T]: HTMLElement | HTMLElement[];
};

/**
 * Retrieves child elements with specified custom data attributes from a given parent element or selector
 *
 * @param dataDoms - Object containing variable names and data attribute names of elements to retrieve
 * @param parent - Parent element selector or direct HTMLElement. Defaults to document
 * @param dataAttributeName - Custom data attribute name. Defaults to 'dom'
 * @returns Object containing the parent element and retrieved elements
 * @throws Error if parent element or child elements are not found
 *
 * @example
 * <div data-dom-parent="parent">
 *   <h1 data-dom="title">Title</h1>
 *   <p data-dom="text">Text</p>
 * </div>
 *
 * const elements = {
 *   title: 'Main title',
 *   text: 'Main text',
 * };
 *
 * try {
 *   const { title, text } = getDataDom(elements);
 * } catch(e) {
 *   console.error(e);
 * }
 */
const getDataDom = <T extends DataDoms = Record<string, never>>(
  dataDoms: T = {} as T,
  parent: string | HTMLElement = document.documentElement,
  dataAttributeName = "dom",
): GetDataDomResult<T> => {
  const parentElement: HTMLElement | null =
    parent instanceof HTMLElement
      ? parent
      : typeof parent === "string"
        ? document.querySelector(
            parent.startsWith("[") ||
              parent.startsWith(".") ||
              parent.startsWith("#")
              ? parent
              : `[data-dom-parent="${parent}"]`,
          )
        : null;

  if (!parentElement) throw new Error(`Parent element not found: ${parent}`);

  /**
   * Retrieves child elements from the parent element based on the specified custom data attribute
   *
   * @param key - Value of the custom data attribute
   * @param name - Description or name of the element (used in error messages)
   * @returns Found element(s). Returns a single element if only one is found, otherwise an array
   * @throws Error if no elements are found
   */
  const getDataDomByKeyName = (
    key: string,
    name: string,
  ): HTMLElement | HTMLElement[] => {
    const elements = Array.from(
      parentElement.querySelectorAll(`[data-${dataAttributeName}="${key}"]`),
    ) as HTMLElement[];

    if (elements.length === 0)
      throw new Error(
        `Element "${name}" not found (data-${dataAttributeName}="${key}")`,
      );

    return elements.length === 1 ? elements[0] : elements;
  };

  const elements = Object.entries(dataDoms).reduce<
    Partial<GetDataDomResult<T>>
  >((acc, [key, name]) => {
    acc[key as keyof T] = getDataDomByKeyName(
      key,
      name,
    ) as GetDataDomResult<T>[keyof T];
    return acc;
  }, {});

  return { parent: parentElement, ...elements } as GetDataDomResult<T>;
};

export { getDataDom };
