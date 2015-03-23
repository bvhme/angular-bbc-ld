'use strict';

describe('Controller: JuicerCtrl', function () {

  // load the controller's module
  beforeEach(module('angularBbcLdApp'));

  var JuicerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    JuicerCtrl = $controller('JuicerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
