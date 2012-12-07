jQuery Intelligent Event
============

This plugin is very useful when you want call page by ajax based on html elements attributes, you can configure all
stuff on html and jquery-ivent do ajax call for you.

How it works
--------------

First you need start events ``$.fn.ivent({default_method: "post"})`` and then set your HTML.

```
<div id="mydiv" data-action="/my-action" data-event="click" data-method="post">
  <input type="text" data-element="username" value="hello"/>
  <div class="stuff">
    <span data-element="phone">78987987</span>
  </div>
  <div data-element="example" data-value="hello">
    <p>My Example</p>
  </div>
</div>
```

On this case when user click on div#mydiv jquery-ivent will objectify all children objects based on data-element and
data-value.

```
{
  action: "/my-action",
  method: "post"
  elements: {
    username: "hello",
    phone: "78987987",
    example: "hello"
  }
}
```

After this jquery-ivent call /my-action page by ajax with elements on data header.

Selectors
--------------

You can use other data-elements out of your html element using data-selector

```
<div id="mydiv" data-action="/my-action" data-event="click" data-method="post">
  <input type="text" data-element="username" value="hello"/>
  <span data-selector="#external"></span>
</div>
<div data-element="external" id="external">
  My External
</div>
```

Or just set on data-action element

```
<div id="mydiv" data-action="/my-action" data-event="click" data-method="post" data-selector="#external">
  My action
</div>
<div id="external">
  <input type="text" data-element="username" value="hello"/>
</div>
```

Triggers
--------------
- iv_[event_name] called after html is transformed in object
- iv_action_[action_name] called after event trigger
- iv_execute_[method_name] called before ajax call

**If you want stop the process on trigger just add stop property on object**

```
$(document).on("iv_click", "#test", function(e, object) {
  //My trigger code
});

$(document).on("iv_execute_post", function(e, object) {
  //My trigger code
  object.stop = true
});
```

Callbacks
--------------
The callbacks is just applied when you are using ajax, you can set ``object.callbacks`` object.
- object.callbacks.done when ajax call finish with success
- object.callbacks.fail when ajax call fail
- object.callbacks.always always after ajax call
