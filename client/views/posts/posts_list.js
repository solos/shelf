/**
 * @overview
 *
 * @author 
 * @version 2014/08/23
 */

Template.postsList.helpers({
    posts: function() {
        return Posts.find({}, {sort: {submitted: -1}});
    }
});

