// const AmonLib = require('@amontech/amon-lib');
// const merge = require('lodash/merge');
//
// const throwError = (message, detail) => {
//   const err = new Error(message);
//
//   merge(err, detail);
//
//   throw err;
// };
//
// const throwExposable = (code, status, description, exposeMeta) => {
//   const error = getError(code);
//   if (!error) {
//     throwError('unknown_error_code', {
//       code,
//       status,
//       description,
//       exposeMeta,
//     });
//   }
//   const err = new Error(code);
//   err.exposeCustom_ = true;
//
//   err.status = status || error.status;
//   err.description = description || error.description;
//   if (exposeMeta) {
//     err.exposeMeta = exposeMeta;
//   }
//
//   throw err;
// };
//
// function getError(errorCode) {
//   const code = ERRORS[errorCode];
//   if (!errorCode || !code) {
//     return null;
//   }
//   return code;
// }
//
// function assert(condition, ...args) {
//   if (!condition) {
//     throwError(...args);
//   }
// }
//
// function assertExposable(condition, ...args) {
//   if (!condition) {
//     throwExposable(...args);
//   }
// }
//
// const ERRORS = [
//   // Admin API
//   {
//     code: 'user_deleted',
//     status: 400,
//     description: 'User must not be deleted to perform this action.',
//   },
//   {
//     code: 'proof_of_funds_already_reviewed',
//     status: 400,
//     description: 'Proof of fund already reviewed.',
//   },
//   {
//     code: 'proof_of_fund_not_reviewed',
//     status: 400,
//     description: 'Proof of fund must be reviewed to perform this action.',
//   },
//   {
//     code: 'unsupported_refund_transaction',
//     status: 400,
//     description: 'Transaction status should be blocked and the type should be incoming',
//   },
//   {
//     code: 'limit_level_invalid',
//     status: 400,
//     description: 'Limit level is invalid',
//   },
//   {
//     code: 'submitted_refund',
//     status: 400,
//     description: 'Transaction refund already submitted',
//   },
//
//   // Internal
//   {
//     code: 'too_busy',
//     status: 503,
//     description: 'Server too busy.',
//   },
//   {
//     code: 'kyc_hook_not_found',
//     status: 400,
//     description: 'KYC not found',
//   },
// ]
//   .concat(AmonLib.prototype.errorCodes.api)
//   .reduce((acc, error) => {
//     acc[error.code] = {
//       status: error.status,
//       description: error.description,
//     };
//
//     return acc;
//   }, {});
//
// module.exports = {
//   throwError,
//   throwExposable,
//   assert,
//   assertExposable,
//   ERRORS,
// };
//
// /****
//  HTTP ERROR CODES
//
//  100 "continue"
//  101 "switching protocols"
//  102 "processing"
//  200 "ok"
//  201 "created"
//  202 "accepted"
//  203 "non-authoritative information"
//  204 "no content"
//  205 "reset content"
//  206 "partial content"
//  207 "multi-status"
//  208 "already reported"
//  226 "im used"
//  300 "multiple choices"
//  301 "moved permanently"
//  302 "found"
//  303 "see other"
//  304 "not modified"
//  305 "use proxy"
//  307 "temporary redirect"
//  308 "permanent redirect"
//  400 "bad request"
//  401 "unauthorized"
//  402 "payment required"
//  403 "forbidden"
//  404 "not found"
//  405 "method not allowed"
//  406 "not acceptable"
//  407 "proxy authentication required"
//  408 "request timeout"
//  409 "conflict"
//  410 "gone"
//  411 "length required"
//  412 "precondition failed"
//  413 "payload too large"
//  414 "uri too long"
//  415 "unsupported media type"
//  416 "range not satisfiable"
//  417 "expectation failed"
//  418 "I'm a teapot"
//  422 "unprocessable entity"
//  423 "locked"
//  424 "failed dependency"
//  426 "upgrade required"
//  428 "precondition required"
//  429 "too many requests"
//  431 "request header fields too large"
//  500 "internal server error"
//  501 "not implemented"
//  502 "bad gateway"
//  503 "service unavailable"
//  504 "gateway timeout"
//  505 "http version not supported"
//  506 "variant also negotiates"
//  507 "insufficient storage"
//  508 "loop detected"
//  510 "not extended"
//  511 "network authentication required"
//  */
