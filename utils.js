// When a user fills out the form for a new post, create a new model and a new view, associate them and render them to the page. First add a View to utils.js:

const Collection = config => {
  const models = [];

  const init = () => {
    if (config) {
      models.push(config);
    }
  };

  let changeCallback = null;

  const add = item => {
    if (!_.includes(models, item) || _.isEmpty(models)) {
      models.push(item);

      if (changeCallback) {
        changeCallback();
      }
    }
  };

  const change = func => (changeCallback = func);

  init();

  return {
    add,
    models,
    change
  };
};

const Model = config => {
  const attributes = {};
  let changeCallback = null;

  const init = () => Object.assign(attributes, config);

  const set = (prop, value) => {
    const tempObj = Object.assign({}, attributes);

    tempObj[prop] = value;

    if (!_.isEqual(attributes, tempObj)) {
      attributes[prop] = value;

      if (changeCallback) {
        changeCallback();
      }
    }
  };

  const get = prop => attributes[prop];
  const change = func => (changeCallback = func);

  init();

  return {
    set,
    get,
    change
  };
};

const View = (model, template) => {
  const render = function() {
    var attrs = model.getAttributes();
    return template(attrs);
  };

  return {
    render
  };
};

$('.add-post').on('click', function() {
  var user = $('#post-user').val();
  var text = $('#post-name').val();

  var postModel = Model({ text: text, name: user });
});
// View takes two arguments: its model and the template. The template will be a template function built with handlebars. Inside render, turn the model into a simple object and invoke the template function using that object. 

// Add a getAttributes function to the Model factory function so that the view's render works.

$('.add-post').on('click', function() {
  var user = $('#post-user').val();
  var text = $('#post-name').val();

  var postModel = Model({ text: text, name: user });

  var template = Handlebars.compile($('#post-template').html());

  var postView = View(postModel, template);

  postModel.change(function() {
    postView.render();
  });

  $('.posts').append(postView.render());
});

