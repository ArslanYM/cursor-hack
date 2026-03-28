/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as farmerActions from "../farmerActions.js";
import type * as farmerQuery from "../farmerQuery.js";
import type * as groqClient from "../groqClient.js";
import type * as smartContext from "../smartContext.js";
import type * as smartContextMutations from "../smartContextMutations.js";
import type * as smartContextQueries from "../smartContextQueries.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  farmerActions: typeof farmerActions;
  farmerQuery: typeof farmerQuery;
  groqClient: typeof groqClient;
  smartContext: typeof smartContext;
  smartContextMutations: typeof smartContextMutations;
  smartContextQueries: typeof smartContextQueries;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
