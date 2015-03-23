'use strict';

describe('Controller: TestsCtrl', function () {

  // load the controller's module
  beforeEach(module('angularBbcLdApp'));

  var TestsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TestsCtrl = $controller('TestsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
