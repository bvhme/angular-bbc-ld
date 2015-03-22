'use strict';

describe('Service: bbcLd', function () {

  // load the service's module
  beforeEach(module('angularBbcLdApp'));

  // instantiate service
  var bbcLd;
  beforeEach(inject(function (_bbcLd_) {
    bbcLd = _bbcLd_;
  }));

  it('should do something', function () {
    expect(!!bbcLd).toBe(true);
  });

});
