import { processItemsInBatches } from '@/react/common/processItemsInBatches';

angular.module('portainer.app').controller('StacksController', StacksController);

/* @ngInject */
function StacksController($scope, $state, Notifications, StackService, Authentication, endpoint) {
  $scope.removeAction = function (selectedItems) {
    return deleteSelectedStacks(selectedItems);
  };

  $scope.restartAction = function (selectedItems) {
    return restartSelectedStacks(selectedItems);
  };

  $scope.stopAction = function (selectedItems) {
    return stopSelectedStacks(selectedItems);
  };

  async function deleteSelectedStacks(selectedItems) {
    const endpointId = endpoint.Id;

    async function doRemove(stack) {
      return StackService.remove(stack, stack.External, endpointId)
        .then(function success() {
          Notifications.success('Stack successfully removed', stack.Name);
          var index = $scope.stacks.indexOf(stack);
          $scope.stacks.splice(index, 1);
        })
        .catch(function error(err) {
          Notifications.error('Failure', err, 'Unable to remove stack ' + stack.Name);
        });
    }

    await processItemsInBatches(selectedItems, doRemove);
    $state.reload();
  }

  async function restartSelectedStacks(selectedItems) {
    const endpointId = endpoint.Id;

    async function doRestart(stack) {
      return StackService.start(endpointId, stack.Id, true)
        .then(function success() {
          Notifications.success('Stack successfully restarted', stack.Name);
          var index = $scope.stacks.indexOf(stack);
          $scope.stacks.splice(index, 1);
        })
        .catch(function error(err) {
          Notifications.error('Failure', err, 'Unable to restart stack ' + stack.Name);
        });
    }

    await processItemsInBatches(selectedItems, doRestart);
    $state.reload();
  }

  async function stopSelectedStacks(selectedItems) {
    const endpointId = endpoint.Id;

    async function doStop(stack) {
      return StackService.stop(endpointId, stack.Id)
        .then(function success() {
          Notifications.success('Stack successfully stopped', stack.Name);
          var index = $scope.stacks.indexOf(stack);
          $scope.stacks.splice(index, 1);
        })
        .catch(function error(err) {
          Notifications.error('Failure', err, 'Unable to stop stack ' + stack.Name);
        });
    }

    await processItemsInBatches(selectedItems, doStop);
    $state.reload();
  }

  $scope.createEnabled = false;

  $scope.getStacks = getStacks;

  function getStacks() {
    const endpointMode = $scope.applicationState.endpoint.mode;
    const endpointId = endpoint.Id;

    const includeOrphanedStacks = Authentication.isAdmin();
    StackService.stacks(true, endpointMode.provider === 'DOCKER_SWARM_MODE' && endpointMode.role === 'MANAGER', endpointId, includeOrphanedStacks)
      .then(function success(stacks) {
        $scope.stacks = stacks;
      })
      .catch(function error(err) {
        $scope.stacks = [];
        Notifications.error('Failure', err, 'Unable to retrieve stacks');
      });
  }

  async function canManageStacks() {
    return endpoint.SecuritySettings.allowStackManagementForRegularUsers || Authentication.isAdmin();
  }

  async function initView() {
    // if the user is not an admin, and stack management is disabled for non admins, then take the user to the dashboard
    $scope.createEnabled = await canManageStacks();
    if (!$scope.createEnabled) {
      $state.go('docker.dashboard');
    }
    getStacks();
  }

  initView();
}
