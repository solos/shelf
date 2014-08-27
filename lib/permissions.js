/**
 * @overview
 *
 * @author 
 * @version 2014/08/23
 */

// check that the userId specified owns the documents
ownsDocument = function(userId, doc) {
   return doc && doc.userId === userId;
}
