import React, { ComponentType, FC, Suspense, SuspenseProps } from "react";
import { isProdEnv } from "@/_private/nodeEnv";

/** ------------------------------------------
 * * ***Higher-Order Component (HOC): `WithSuspense`.***
 * ------------------------------------------
 * **Wrapping a component with React Suspense.**
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
  const WrappedComponent: FC<P> = (props) => {
    return (
      <Suspense {...suspenseProps}>
        <Component {...props} />
      </Suspense>
    );
  };

  // Set display name for better debugging at non prod env
  const componentName = Component.displayName || Component.name || "Anonymous";
  WrappedComponent.displayName = isProdEnv ? undefined : `WithSuspense(${componentName})`;

  return WrappedComponent;
}
