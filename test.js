var expect = require('chai').expect;
var l = require('lodash');
var sort2sql = require('./index');

describe("Convert Sort String to SQL", function () {
  // tests :: [[str, sql]]
  var tests = [
    // Correct inputs
    ['id', 'id ASC NULLS LAST'],
    ['+id', 'id ASC NULLS LAST'],
    ['-id', 'id DESC NULLS LAST'],
    ['id-', 'id ASC NULLS FIRST'],
    ['+id-', 'id ASC NULLS FIRST'],
    ['-id-', 'id DESC NULLS FIRST'],
    ['show.id', 'show.id ASC NULLS LAST'],
    ['-id,aired-', 'id DESC NULLS LAST, aired ASC NULLS FIRST'],
    ['-id,+aired-', 'id DESC NULLS LAST, aired ASC NULLS FIRST'],
    ['+id-,show.id', 'id ASC NULLS FIRST, show.id ASC NULLS LAST'],

    // Incorrect inputs
    ['lol what', ''],
    ['+-id-', ''],

    // Partially correct inputs
    ['id,++aired+', 'id ASC NULLS LAST'],
    ['?id,+aired-', 'aired ASC NULLS FIRST']
  ];

  var firstColumnSize = l(tests).map(l.head).map(l.size).max().value();

  tests.forEach(function (test) {
    var str = test[0];
    var sql = test[1];
    var humanStr = str + new Array(firstColumnSize - str.length + 1).join(' ');
    var humanSQL = (sql === '' ? '(empty string)' : sql);

    it(humanStr + "  ->  " + humanSQL, function () {
      expect(sort2sql(str)).to.eql(sql);
    });
  });
});
