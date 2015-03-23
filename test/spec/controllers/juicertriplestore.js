'use strict';

describe('Controller: JuicertriplestoreCtrl', function () {

  // load the controller's module
  beforeEach(module('angularBbcLdApp'));

  var JuicertriplestoreCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    JuicertriplestoreCtrl = $controller('JuicertriplestoreCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
