/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import "react";

type RzlTopLoaderAttribute = {
  // add new attribute for loader
  /** * Force trigger loader bar on action.
   *
   * @description It will trigger if button type is submit and has valid form action.
   * @default false
   */
  // "data-submit-rzl-progress-bar"?: boolean;
  /** * Prevent triggering loader bar on action.
   * @default false
   */
  "data-prevent-rzl-progress-bar"?: boolean;
};

declare module "react" {
  interface ButtonHTMLAttributes<T> extends RzlTopLoaderAttribute {}

  interface AnchorHTMLAttributes<T> extends RzlTopLoaderAttribute {}
}
