/**
 * @overview
 *
 * @author 
 * @version 2014/08/23
 */

Meteor.publish('posts', function() {
  return Posts.find();
});
