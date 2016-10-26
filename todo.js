/*
 * To do App
 * @author  - Anand N G
 */
var app = angular.module('todoApp', ['ngMaterial', 'ngMdIcons', 'ui.sortable'])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')})
/*
 * Common service to show material dialog box
 */
.service('toDoListService',['$mdDialog', function($mdDialog) {
  this.showDialog = function(templateUrl,ev,controller) {
    $mdDialog.show({
      templateUrl: templateUrl,
      controller: controller,
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    })
    .then(function() {
    }, function() {
    });
  }
}])
/*
 * To bring common utils
 */
.service('UtilService', function() {
  this.getRandomeId = function() {
    return Math.random().toString(36).substring(7);
  }
})
/*
 * To do list controller
 */
.controller('TodoListController', ['$scope', 'UtilService', 'toDoListService',
function($scope, utils, toDoListService) {
  var vm = this;
  vm.init = function() {
    vm.selectedList = {};
    vm.listItems = [{
        listId: 'list_id_1',
        title: 'List 1',
        cards: [{
          cardId: 'card_id_1',
          title: 'A',
          description: 'Card description',
          comments: [{
            commentId: 'comment_id_1',
            title: 'Comment 1',
            created_at: new Date()
          }, {
            commentId: 'comment_id_2',
            title: 'Comment 2',
            created_at: new Date()
          }, {
            commentId: 'comment_id_3',
            title: 'Comment 3',
            created_at: new Date()
          }]
        }, {
          cardId: 'card_id_2',
          title: 'B',
          description: 'Card description',
          comments: []
        }, {
          cardId: 'card_id_3',
          title: 'C',
          description: 'Card description',
          comments: []
        }]
      }, {
        listId: 'list_id_2',
        title: 'List 2',
        cards: []
      }];
      vm.staticListId = vm.listItems.length;
  }
  vm.deleteList = function(listId) {
    var removeIndex;
    _.each(vm.listItems, function(list, index) {
      if(list.listId === vm.selectedList.listId) {
        removeCardIndex = index;
      }
    });
    vm.listItems.splice(removeIndex, 1);

    if(vm.listItems.length <= 0) {
      vm.staticListId = 0;
    }
  }
  vm.addList = function() {
    if(vm.listItems.length < 4) {
      vm.staticListId = vm.staticListId  + 1;
      var listId = vm.staticListId;
      var title = 'List '+ listId;
      var listObj = {
        listId: 'list_id_'+ listId,
        title: title,
        cards: []
      }
      vm.listItems.push(listObj);
    }
  }
  vm.addCardToList = function(listId) {
    var cardObj = {
      cardId: utils.getRandomeId(),
      title: 'Card title',
      description: '',
      comments: []
    }
    vm.listItems.map(function(list) {
      if(list.listId === listId && list.cards.length < 4) {
        list.cards.push(cardObj);
      }
    })
  }

  vm.showDialog = function(ev, listId, cardId) {
    vm.selectedList = getListById(listId);
    var templateUrl = 'list_form.html';
    if(cardId) {
      templateUrl = 'card_form.html';
      vm.selectedCard = getCardById(vm.selectedList.cards, cardId);
    }
    toDoListService.showDialog(templateUrl,ev,listScope);
  };

  function listScope($scope, $mdDialog) {
    $scope.selectedList = _.clone(vm.selectedList);
    $scope.listTitle = _.clone($scope.selectedList.title);
    $scope.listCardCount = $scope.selectedList.cards.length;
    if(vm.selectedCard) {
      $scope.selectedCard = _.clone(vm.selectedCard);
      $scope.cardTitle = _.clone($scope.selectedCard.title);
    }

    $scope.updateList = function() {
      var listObj = $scope.selectedList;
      vm.listItems.map(function(list) {
        if(list.listId === listObj.listId) {
          list.title = listObj.title;
          list.cards = listObj.cards;
        }
      });
      resetAll();
    }

    $scope.updateCard = function() {
      var cardObj = $scope.selectedCard;
      vm.listItems.map(function(list) {
        if(list.listId === vm.selectedList.listId) {
          list.cards.map(function(card) {
            if(card.cardId === vm.selectedCard.cardId) {
              card.title = cardObj.title;
              card.description = cardObj.description;
              var commentObj = {
                commentId: utils.getRandomeId(),
                title: $scope.comment,
                created_at: new Date()
              }
              card.comments.push(commentObj)
            }
          });
        }
      });
      resetAll();
    }

    $scope.deleteCard = function() {
      vm.listItems.map(function(list) {
        if(list.listId === vm.selectedList.listId) {
          var removeCardIndex;
          _.each(list.cards, function(card, index) {
            if(card.cardId === vm.selectedCard.cardId) {
              removeCardIndex = index;
            }
          });
          list.cards.splice(removeCardIndex, 1);
        }
      });
      resetAll();
    }

    $scope.cancel = function() {
      $mdDialog.cancel();
      resetAll();
    };

    function resetAll() {
      $mdDialog.hide();
      $scope.selectedList ={};
      $scope.selectedCard ={};
      vm.selectedList = {};
      vm.selectedCard ={};
    };
  };

  function getListById(listId) {
    return _.filter(vm.listItems, function(item) {
      return item.listId === listId;
    })[0];
  };

  function getCardById(cards, cardId) {
    return _.filter(cards, function(card) {
      return card.cardId === cardId;
    })[0];
  }

}])
