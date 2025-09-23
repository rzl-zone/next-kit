import React from "react";

/** ---------------------------------------------------------
 * * **Utility: `isReactNode`.**
 * ----------------------------------------------------------
 * **Checks if a value can safely be used as a
 * **[`ReactNode`](https://react.dev/reference/react/ReactNode)** (a valid React child).**
 *
 * - **Covers all official ReactNode cases:**
 *    - `null` / `undefined`
 *    - `string`, `number`, `boolean` (booleans are ignored by React but allowed)
 *    - Any valid `ReactElement` (including Fragment, Portal, etc.)
 *    - Arrays of ReactNode (recursively nested)
 *    - Any **iterable** (e.g. `Set`, `Map.values()`, generator) whose items are ReactNode
 *
 * - **Behavior:**
 *    - Recursively checks arrays and generic iterables.
 *    - Catches iteration errors to avoid runtime exceptions.
 *    - Returns `false` for everything else (functions, plain objects, Date, etc.).
 *
 * @param {unknown} value - The value to test.
 * @returns {boolean} Returns `true` if the value is renderable by React as a child,
 * otherwise `false`.
 *
 * @example
 * isReactNode("hello");               // ➔ true
 * isReactNode(42);                    // ➔ true
 * isReactNode(<div />);               // ➔ true
 * isReactNode([<span key="1" />]);    // ➔ true
 * isReactNode(new Set(["a", "b"]));   // ➔ true
 * isReactNode(() => <div />);         // ➔ false
 */
export function isReactNode(value: unknown): value is React.ReactNode {
  if (value == null) return true; // null or undefined

  switch (typeof value) {
    case "string":
    case "number":
    case "boolean":
      return true;
  }

  if (React.isValidElement(value)) return true;

  if (Array.isArray(value)) return value.every(isReactNode);

  // ---- combined cast for iterable check ----
  const maybeIterable = value as { [Symbol.iterator]?: unknown };
  if (typeof maybeIterable?.[Symbol.iterator] === "function") {
    try {
      for (const item of maybeIterable as Iterable<unknown>) {
        if (!isReactNode(item)) return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  return false;
}
