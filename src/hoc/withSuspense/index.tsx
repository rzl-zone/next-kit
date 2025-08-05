import React, { ComponentType, Suspense, SuspenseProps } from "react";

/** ------------------------------------------
 * * Higher-Order Component (HOC) to wrap a component with React Suspense.
 * ------------------------------------------
 *
 * @template P - Props type of the wrapped component.
 * @param Component - The component to wrap.
 * @param [suspenseProps] - Optional props for Suspense.
 * @returns Wrapped component with Suspense fallback.
 */
export default function WithSuspense<P extends object>(
  Component: ComponentType<P>,
  suspenseProps?: Partial<SuspenseProps>
) {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <Suspense {...suspenseProps}>
        <Component {...props} />
      </Suspense>
    );
  };

  // Set display name for better debugging
  const componentName = Component.displayName || Component.name || "Anonymous";
  WrappedComponent.displayName =
    process.env["NODE_ENV"] === "production"
      ? undefined
      : `WithSuspense(${componentName})`;

  return WrappedComponent;
}
