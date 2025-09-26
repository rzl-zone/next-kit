/** -------------------------------------------------------------------------
 * * **Environment: `nodeEnv`.**
 * --------------------------------------------------------------------------
 * **Represents the current Node.js environment string** as read from
 * **[`process.env["NODE_ENV"]`](https://nodejs.org/api/process.html#processenv).**
 *
 * - **Behavior:**
 *    - Holds the raw value of the `NODE_ENV` environment variable.
 *    - May be any string or `undefined` if not set at runtime.
 *
 * @example
 * if (nodeEnv === "production") {
 *   console.log("Running in production mode");
 * }
 */
export const nodeEnv = (): NodeJS.ProcessEnv["NODE_ENV"] => process?.env["NODE_ENV"];

/** -------------------------------------------------------------------------
 * * **Environment Flag: `isQaEnv`.**
 * --------------------------------------------------------------------------
 * **Checks if `NODE_ENV` equals `"qa"`.**
 *
 * - **Behavior:**
 *    - Returns `true` only when the environment variable is exactly `"qa"`.
 *
 * @example
 * if (isQaEnv()) {
 *   enableQaFeatures();
 * }
 */
export const isQaEnv = () => process?.env["NODE_ENV"] === "qa";

/** -------------------------------------------------------------------------
 * * **Environment Flag: `isTestEnv`.**
 * --------------------------------------------------------------------------
 * **Checks if `NODE_ENV` equals `"test"`.**
 *
 * - **Behavior:**
 *    - Returns `true` only when the environment variable is exactly `"test"`.
 *
 * @example
 * if (isTestEnv()) {
 *   runIntegrationTests();
 * }
 */
export const isTestEnv = () => process?.env["NODE_ENV"] === "test";

/** -------------------------------------------------------------------------
 * * **Environment Flag: `isPreviewEnv`.**
 * --------------------------------------------------------------------------
 * **Checks if `NODE_ENV` equals `"preview"`.**
 *
 * - **Behavior:**
 *    - Returns `true` only when the environment variable is exactly `"preview"`.
 *
 * @example
 * if (isPreviewEnv()) {
 *   console.log("Preview deployment features enabled");
 * }
 */
export const isPreviewEnv = () => process?.env["NODE_ENV"] === "preview";

/** -------------------------------------------------------------------------
 * * **Environment Flag: `isStagingEnv`.**
 * --------------------------------------------------------------------------
 * **Checks if `NODE_ENV` equals `"staging"`.**
 *
 * - **Behavior:**
 *    - Returns `true` only when the environment variable is exactly `"staging"`.
 *
 * @example
 * if (isStagingEnv()) {
 *   console.log("Running in staging environment");
 * }
 */
export const isStagingEnv = () => process?.env["NODE_ENV"] === "staging";

/** -------------------------------------------------------------------------
 * * **Environment Flag: `isDevEnv`.**
 * --------------------------------------------------------------------------
 * **Checks if `NODE_ENV` equals `"development"`.**
 *
 * - **Behavior:**
 *    - Returns `true` only when the environment variable is exactly `"development"`.
 *
 * @example
 * if (isDevEnv()) {
 *   enableHotReload();
 * }
 */
export const isDevEnv = () => process?.env["NODE_ENV"] === "development";

/** -------------------------------------------------------------------------
 * * **Environment Flag: `isProdEnv`.**
 * --------------------------------------------------------------------------
 * **Checks if `NODE_ENV` equals `"production"`.**
 *
 * - **Behavior:**
 *    - Returns `true` only when the environment variable is exactly `"production"`.
 *
 * @example
 * if (isProdEnv()) {
 *   enableProductionOptimizations();
 * }
 */
export const isProdEnv = () => process?.env["NODE_ENV"] === "production";
