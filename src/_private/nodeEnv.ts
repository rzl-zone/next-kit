/** -------------------------------------------------------------------------
 * * **Environment: `nodeEnv`.**
 * --------------------------------------------------------------------------
 * **Represents the current Node.js environment string** as read from
 * **[`process?.env["NODE_ENV"]`](https://nodejs.org/api/process.html#processenv).**
 *
 * - **Behavior:**
 *    - Holds the raw value of the `NODE_ENV` environment variable.
 *    - May be any string or `undefined` if not set at runtime.
 *
 * @type {string | undefined}
 * @example
 * if (nodeEnv === "production") {
 *   console.log("Running in production mode");
 * }
 */
export const nodeEnv: (typeof process.env)["NODE_ENV"] = process?.env["NODE_ENV"];

/** -------------------------------------------------------------------------
 * * **Environment Flag: `isQaEnv`.**
 * --------------------------------------------------------------------------
 * **Checks if `NODE_ENV` equals `"qa"`.**
 *
 * - **Behavior:**
 *    - Returns `true` only when the environment variable is exactly `"qa"`.
 *
 * @type {boolean}
 * @example
 * if (isQaEnv) {
 *   enableQaFeatures();
 * }
 */
export const isQaEnv: boolean = process?.env["NODE_ENV"] === "qa";

/** -------------------------------------------------------------------------
 * * **Environment Flag: `isTestEnv`.**
 * --------------------------------------------------------------------------
 * **Checks if `NODE_ENV` equals `"test"`.**
 *
 * - **Behavior:**
 *    - Returns `true` only when the environment variable is exactly `"test"`.
 *
 * @type {boolean}
 * @example
 * if (isTestEnv) {
 *   runIntegrationTests();
 * }
 */
export const isTestEnv: boolean = process?.env["NODE_ENV"] === "test";

/** -------------------------------------------------------------------------
 * * **Environment Flag: `isPreviewEnv`.**
 * --------------------------------------------------------------------------
 * **Checks if `NODE_ENV` equals `"preview"`.**
 *
 * - **Behavior:**
 *    - Returns `true` only when the environment variable is exactly `"preview"`.
 *
 * @type {boolean}
 * @example
 * if (isPreviewEnv) {
 *   console.log("Preview deployment features enabled");
 * }
 */
export const isPreviewEnv: boolean = process?.env["NODE_ENV"] === "preview";

/** -------------------------------------------------------------------------
 * * **Environment Flag: `isStagingEnv`.**
 * --------------------------------------------------------------------------
 * **Checks if `NODE_ENV` equals `"staging"`.**
 *
 * - **Behavior:**
 *    - Returns `true` only when the environment variable is exactly `"staging"`.
 *
 * @type {boolean}
 * @example
 * if (isStagingEnv) {
 *   console.log("Running in staging environment");
 * }
 */
export const isStagingEnv: boolean = process?.env["NODE_ENV"] === "staging";

/** -------------------------------------------------------------------------
 * * **Environment Flag: `isDevEnv`.**
 * --------------------------------------------------------------------------
 * **Checks if `NODE_ENV` equals `"development"`.**
 *
 * - **Behavior:**
 *    - Returns `true` only when the environment variable is exactly `"development"`.
 *
 * @type {boolean}
 * @example
 * if (isDevEnv) {
 *   enableHotReload();
 * }
 */
export const isDevEnv: boolean = process?.env["NODE_ENV"] === "development";

/** -------------------------------------------------------------------------
 * * **Environment Flag: `isProdEnv`.**
 * --------------------------------------------------------------------------
 * **Checks if `NODE_ENV` equals `"production"`.**
 *
 * - **Behavior:**
 *    - Returns `true` only when the environment variable is exactly `"production"`.
 *
 * @type {boolean}
 * @example
 * if (isProdEnv) {
 *   enableProductionOptimizations();
 * }
 */
export const isProdEnv: boolean = process?.env["NODE_ENV"] === "production";
