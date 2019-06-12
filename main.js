var ProjectReddit = function() {
  var posts = Collection();

  var $posts = $('.posts');

  var createPost = function(text, user) {
    var postModel = Model({ text: text, name: user, comments: [] });

    postModel.change(function() {
      app.renderComments();
    });

    posts.add(postModel);

    // Triggered when something is added to `posts`
    renderComments();
  };

  // Empty all posts, then add them from the posts array along with
  // new comments HTML
  var renderPosts = function() {
    $posts.empty();

    for (var i = 0; i < posts.models.length; i += 1) {
      var post = posts.models[i];

      var commentsContainer =
        '<div class="comments-container">' +
        '<div class=comments-list></div>' +
        '<input type="text" class="comment-name" placeholder="Comment Text">' +
        '<input type="text" class="comment-user" placeholder="User Name"><button class="btn btn-primary add-comment">Post Comment</button> </div>';

      $posts.append(
        '<div class="post">' +
          '<a href="#" class="remove">remove</a> ' +
          '<a href="#" class="show-comments">comments</a> ' +
          post.get('text') +
          commentsContainer +
          ' <div> Posted By: <strong> ' +
          post.get('name') +
          '</strong></div></div>'
      );
    }
  };

  var renderComments = function() {
    $('.comments-list').empty();

    for (var i = 0; i < posts.models.length; i += 1) {
      // The current post in the iteration
      var post = posts.models[i];

      // Find the "post" element in the page that is equal to the
      // current post that's being iterating on
      var $post = $('.posts')
        .find('.post')
        .eq(i);

      // Iterate through each comment in post's comments array
      for (var j = 0; j < post.get('comments').length; j += 1) {
        // The current comment in the iteration
        var comment = post.get('comments')[j];

        // Append the comment to the post we wanted to comment on
        $post
          .find('.comments-list')
          .append(
            '<div class="comment">' +
              comment.text +
              'Posted By: <strong>' +
              comment.name +
              '</strong><a class="remove-comment"><i class="fa fa-times" aria-hidden="true"></i></a>' +
              '</div>'
          );
      }
    }
  };

  var removePost = function(currentPost) {
    var $clickedPost = $(currentPost).closest('.post');

    var index = $clickedPost.index();

    posts.models.splice(index, 1);
    $clickedPost.remove();
  };

  var toggleComments = function(currentPost) {
    var $clickedPost = $(currentPost).closest('.post');
    $clickedPost.find('.comments-container').toggleClass('show');
  };

  var createComment = function(text, name, postIndex) {
    var comment = { text: text, name: name };

    var currentComments = posts.models[postIndex].get('comments');

    var tempComments = [];

    tempComments.push(comment);

    var comments = currentComments.concat(tempComments);

    posts.models[postIndex].set('comments', comments);
  };

  var removeComment = function(commentButton) {
    // The comment element to be removed
    var $clickedComment = $(commentButton).closest('.comment');

    // Index of the comment element on the page
    var commentIndex = $clickedComment.index();

    // Index of the post in the posts div that the comment belongs to
    var postIndex = $clickedComment.closest('.post').index();

    // Removing the comment from the page
    $clickedComment.remove();

    // Remove the comment from the comments array on the correct post object
    posts.models[postIndex].get('comments').splice(commentIndex, 1);
  };

  return {
    posts: posts,
    createPost: createPost,
    renderPosts: renderPosts,
    removePost: removePost,

    createComment: createComment,
    renderComments: renderComments,
    removeComment: removeComment,
    toggleComments: toggleComments
  };
};

var app = ProjectReddit();

app.posts.change(function() {
  app.renderPosts();
});

app.renderPosts();
app.renderComments();

// Events
$('.add-post').on('click', function(e) {
  e.preventDefault();

  var text = $('#post-name').val();
  var user = $('#post-user').val();
  app.createPost(text, user);
});

$('.posts').on('click', '.remove', function() {
  app.removePost(this);
});

$('.posts').on('click', '.show-comments', function() {
  app.toggleComments(this);
});

$('.posts').on('click', '.add-comment', function() {
  var text = $(this)
    .siblings('.comment-name')
    .val();
  var name = $(this)
    .siblings('.comment-user')
    .val();

  // Finding the index of the post in the page to be used for #createComment
  var postIndex = $(this)
    .closest('.post')
    .index();

  app.createComment(text, name, postIndex);
});

$('.posts').on('click', '.remove-comment', function() {
  app.removeComment(this);
});
