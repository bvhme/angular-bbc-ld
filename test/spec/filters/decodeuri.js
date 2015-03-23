'use strict';

describe('Filter: decodeURI', function () {

  // load the filter's module
  beforeEach(module('angularBbcLdApp'));

  // initialize a new instance of the filter before each test
  var decodeURI;
  beforeEach(inject(function ($filter) {
    decodeURI = $filter('decodeURI');
  }));

  it('should return the input prefixed with "decodeURI filter:"', function () {
    var text = 'angularjs';
    expect(decodeURI(text)).toBe('decodeURI filter: ' + text);
  });

});
