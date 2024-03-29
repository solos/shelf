/**
 * @overview
 *
 * @author 
 * @version 2014/08/23
 */

Posts = new Meteor.Collection('posts');

Posts.allow({
    update: ownsDocument,
    remove: ownsDocument,
});

Posts.deny({
    update: function(userId, post, fieldNames){
        return (_.without(fieldNames, 'url', 'title').length > 0);
    }
});

Posts.deny({
    update: function(userId, doc, fields, modifier) {
        doc.lastModified = +(new Date());
        return false;
    },
    transform: null
});

Meteor.methods({
    post: function(postAttributes) {
        var user = Meteor.user(),

        postWithSameLink = Posts.findOne({
            url: postAttributes.url
        });

        // ensure the user is logged in
        if (!user)
            throw new Meteor.Error(401, "You need to login to post new stories");

        // ensure the post has a title
        if (!postAttributes.title)
            throw new Meteor.Error(422, 'Please fill in a headline');

        // check that there are no previous posts with the same link
        if (postAttributes.url && postWithSameLink) {
            throw new Meteor.Error(302, 'This link has already been posted', postWithSameLink._id);
        }


        // pick out the whitelisted keys
        var post = _.extend(_.pick(postAttributes, 'url', 'message'), {
            title: postAttributes.title + (this.isSimulation ? '(client)' : '(server)'),
            userId: user._id, 
            author: user.username, 
            submitted: new Date().getTime()
        });

        // wait for 5 seconds
        if (! this.isSimulation) {
            var Future = Npm.require('fibers/future');
            var future = new Future();
            Meteor.setTimeout(function() {
                future.return();
            }, 0 * 1000);
            future.wait();
        }

        var postId = Posts.insert(post);

        return postId;
    }
});
