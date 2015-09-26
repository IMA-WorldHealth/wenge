/**
* Tools
*
* This library contains tools useful throughout the application.
*/

exports.collect = collect;

/**
* This function aggregates arrays of data into a single top level object, with
* rows arranged in a tree structure.  It is designed to represent database JOIN
* operations.
*
*
* @constructor
* @param {Array} array An array of database rows
* @param {String} treeName Name of the property under which the tree will be
*   nested.
* @param {Array} treeKeys An array of keys to be mapped into the tree.
* @returns {Object} The mapped JSON object
*/
function collect(array, treeName, treeKeys) {
  'use strict';

  var tree = {},
      head = array[0];

  // if the key is not in the tree keys, add it to the "root" node
  for (var key in head) {
    if (head.hasOwnProperty(key) && treeKeys.indexOf(key) === -1) {
      tree[key] = head[key];
    }
  }

  // map all the tree keys into the tree
  tree[treeName] = array.map(function (object) {
    var o = {};

    treeKeys.forEach(function (key) {
      o[key] = object[key];
    });

    return o;
  });

  return tree;
}
