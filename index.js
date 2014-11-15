/**
 * # Convert Sort Expression to SQL
 *
 * Converts 'sort format' to 'SQL format'. E.g.:
 *
 * - '-id' -> 'id DESC NULLS LAST'
 * - 'id'  -> 'id ASC NULLS LAST'
 * - 'id-' -> 'id ASC NULLS FIRST'
 * - '-aired,id' -> 'aired DESC NULLS LAST, id ASC NULLS LAST'
 *
 * (See tests file for more examples.)
 */

var sortStrFormat = /^([+-]|)([\w.]+)(-|)$/;

/**
 * Convert One Sort Expression to SQL
 *
 * @param  {String} sortStr The input, e.g. '-id'.
 * @return {String} String to use in `ORDER BY` or an empty string if the
 *   input was invalid.
 */
function convertOneSortStrFieldToSQL(sortStr) {
  'use strict';
  var parsed = sortStr.match(sortStrFormat);
  if (parsed === null) {
    return '';
  }

  var field = parsed[2];
  var order = parsed[1] === '-' ? 'DESC' : 'ASC';
  var nulls = parsed[3] === '-' ? 'NULLS FIRST' : 'NULLS LAST';

  return field + ' ' + order + ' ' + nulls;
}

/**
 * Convert Sort Expression to SQL
 *
 * @param  {String} sortStr The input, e.g. '-date,+name,id'.
 * @return {String} String that can be used in `ORDER BY` or empty string if
 *   the input was invalid. When parts of the input are invalid, they will be
 *   ommited.
 */
module.exports = function convertSortStrToSQL(sortStr) {
  'use strict';
  if (typeof sortStr !== 'string') { return ''; }

  return sortStr.split(',')
  .map(convertOneSortStrFieldToSQL)
  .filter(function (str) { return str !== ''; })
  .join(', ');
};
