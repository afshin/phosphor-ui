/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/


/**
 * Test whether a client position lies within a node.
 *
 * @param node - The DOM node of interest.
 *
 * @param clientX - The client X coordinate of interest.
 *
 * @param clientY - The client Y coordinate of interest.
 *
 * @returns `true` if the node covers the position, `false` otherwise.
 *
 * #### Example
 * ```typescript
 * import { hitTest } from 'phosphor-ui/lib/domutil';
 *
 * let div = document.createElement('div');
 * div.style.position = 'absolute';
 * div.style.left = '0px';
 * div.style.top = '0px';
 * div.style.width = '100px';
 * div.style.height = '100px';
 * document.body.appendChild(div);
 *
 * hitTest(div, 50, 50);   // true
 * hitTest(div, 150, 150); // false
 * ```
 */
export
function hitTest(node: Element, clientX: number, clientY: number): boolean {
  let rect = node.getBoundingClientRect();
  return (
    clientX >= rect.left &&
    clientX < rect.right &&
    clientY >= rect.top &&
    clientY < rect.bottom
  );
}


/**
 * The box sizing (border and padding) for a a DOM node.
 */
export
interface IBoxSizing {
  /**
   * The top border width, in pixels.
   */
  borderTop: number;

  /**
   * The left border width, in pixels.
   */
  borderLeft: number;

  /**
   * The right border width, in pixels.
   */
  borderRight: number;

  /**
   * The bottom border width, in pixels.
   */
  borderBottom: number;

  /**
   * The top padding width, in pixels.
   */
  paddingTop: number;

  /**
   * The left padding width, in pixels.
   */
  paddingLeft: number;

  /**
   * The right padding width, in pixels.
   */
  paddingRight: number;

  /**
   * The bottom padding width, in pixels.
   */
  paddingBottom: number;

  /**
   * The sum of horizontal border and padding.
   */
  horizontalSum: number;

  /**
   * The sum of vertical border and padding.
   */
  verticalSum: number;
}


/**
 * Compute the box sizing for a DOM node.
 *
 * @param node - The DOM node for which to compute the box sizing.
 *
 * @returns The box sizing data for the specified DOM node.
 *
 * #### Example
 * ```typescript
 * import { boxSizing } from 'phosphor-ui/lib/domutil';
 *
 * let div = document.createElement('div');
 * div.style.borderTop = 'solid 10px black';
 * document.body.appendChild(div);
 *
 * let sizing = boxSizing(div);
 * sizing.borderTop;    // 10
 * sizing.paddingLeft;  // 0
 * // etc...
 * ```
 */
export
function boxSizing(node: HTMLElement): IBoxSizing {
  let cstyle = window.getComputedStyle(node);
  let bt = parseInt(cstyle.borderTopWidth, 10) || 0;
  let bl = parseInt(cstyle.borderLeftWidth, 10) || 0;
  let br = parseInt(cstyle.borderRightWidth, 10) || 0;
  let bb = parseInt(cstyle.borderBottomWidth, 10) || 0;
  let pt = parseInt(cstyle.paddingTop, 10) || 0;
  let pl = parseInt(cstyle.paddingLeft, 10) || 0;
  let pr = parseInt(cstyle.paddingRight, 10) || 0;
  let pb = parseInt(cstyle.paddingBottom, 10) || 0;
  let hs = bl + pl + pr + br;
  let vs = bt + pt + pb + bb;
  return {
    borderTop: bt,
    borderLeft: bl,
    borderRight: br,
    borderBottom: bb,
    paddingTop: pt,
    paddingLeft: pl,
    paddingRight: pr,
    paddingBottom: pb,
    horizontalSum: hs,
    verticalSum: vs
  };
}


/**
 * The size limits for a DOM node.
 */
export
interface ISizeLimits {
  /**
   * The minimum width, in pixels.
   */
  minWidth: number;

  /**
   * The minimum height, in pixels.
   */
  minHeight: number;

  /**
   * The maximum width, in pixels.
   */
  maxWidth: number;

  /**
   * The maximum height, in pixels.
   */
  maxHeight: number;
}


/**
 * Compute the size limits for a DOM node.
 *
 * @param node - The node for which to compute the size limits.
 *
 * @returns The size limit data for the specified DOM node.
 *
 * #### Example
 * ```typescript
 * import { sizeLimits } from 'phosphor-ui/lib/domutil';
 *
 * let div = document.createElement('div');
 * div.style.minWidth = '90px';
 * document.body.appendChild(div);
 *
 * let limits = sizeLimits(div);
 * limits.minWidth;   // 90
 * limits.maxHeight;  // Infinity
 * // etc...
 * ```
 */
export
function sizeLimits(node: HTMLElement): ISizeLimits {
  let cstyle = window.getComputedStyle(node);
  return {
    minWidth: parseInt(cstyle.minWidth, 10) || 0,
    minHeight: parseInt(cstyle.minHeight, 10) || 0,
    maxWidth: parseInt(cstyle.maxWidth, 10) || Infinity,
    maxHeight: parseInt(cstyle.maxHeight, 10) || Infinity
  };
}


/**
 * Scroll an element into view if needed.
 *
 * @param area - The scroll area element.
 *
 * @param elem - The element of interest.
 *
 * @param threshold - The overflow threshold required before scrolling.
 *
 * #### Example
 * ```typescript
 * import { scrollIfNeeded } from 'phosphor-ui/lib/domutil';
 *
 * let area = document.createElement('div');
 * let elem = document.createElement('div');
 * // Style the scrollable area to have a small height and a black border.
 * area.style.height = '100px';
 * area.style.overflow = 'auto';
 * area.style.border = '1px solid black';
 * // Style the element of interest to have a red border and some content.
 * elem.style.border = '1px solid red';
 * elem.textContent = 'visible content';
 * // Add enough whitespace to the scrollable area to guarantee scrolling.
 * for (let i = 0; i < 50; i++) area.appendChild(document.createElement('br'));
 * // Attach the nodes to the DOM.
 * area.appendChild(elem);
 * document.body.appendChild(area);
 * // Scroll to the element of interest.
 * scrollIfNeeded(area, elem);
 * ```
 */
export
function scrollIfNeeded(area: HTMLElement, elem: HTMLElement, threshold = 10): void {
  let ar = area.getBoundingClientRect();
  let er = elem.getBoundingClientRect();
  if (er.top < ar.top - threshold) {
    area.scrollTop -= ar.top - er.top + threshold;
  } else if (er.bottom > ar.bottom + threshold) {
    area.scrollTop += er.bottom - ar.bottom + threshold;
  }
}
