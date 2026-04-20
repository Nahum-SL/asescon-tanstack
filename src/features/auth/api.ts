// En TanStack Start, las llamadas autenticadas van por createServerFn (server/auth.ts)
// Este archivo queda para reexportar y para llamadas de cliente que no necesitan cookies
// Reexportamos las server fns para que los componentes tengan un solo punto de import
export { loginFn, verify2FAFn, logoutFn, getMeFn } from "#/server/auth";
