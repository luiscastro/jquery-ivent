/*
 * jQuery Ivent Plugin 1.0
 */
(function($) {

  var ivent_conf = {
    default_method : "post"
  };

  var methods = {
    init : function(options) {
      ivent_conf = $.extend({}, ivent_conf, options);

      $(document).ready(function() {
        var events = {};
        $("[data-event]").each(function(index, value) {
          event_name = $(value).data("event");
          if (events[event_name] == undefined) {
            $(document).on(event_name, "[data-event=" + event_name + "]", function(e) {
              e.stopPropagation();
              $(this).ivent("run", e.type);
              return false;
            });
          }
          events[event_name] = true;
        });
      });
    },
    run : function(e) {
      object = $(this).ivent("objectify");
      object.selector.trigger("iv_" + e, object);
      if (object.stop != undefined && object.stop == true) {
        return;
      }
      object.selector.trigger("iv_action_" + object.action, object);
      if (object.stop != undefined && object.stop == true) {
        return;
      }
      object.selector.ivent("execute", object);
    },
    objectify : function() {
      object = {};
      object.callbacks = {};
      object.action = $(this).data("action");
      object.method = $(this).data("method");
      if (object.method == undefined) {
        object.method = ivent_conf.default_method;
      }

      object.selector = $(this).data("selector");
      if (object.selector == undefined) {
        object.selector = $(this);
      }
      else {
        object.selector = $(object.selector);
      }

      object.elements = {};
      object.selector.find("[data-element]").each(function(index, value) {
        wrap = $(value);
        if(wrap.data("selector") != undefined) {
          wrap = wrap.find($(value).data("selector"));
        }
        if (wrap.data("value") != undefined) {
          object.elements[wrap.data("element")] = wrap.data("value");
        }
        else if(wrap.is("input, select")) {
          object.elements[wrap.data("element")] = wrap.val();
        }
        else if(wrap.find("*").length == 0) {
          object.elements[wrap.data("element")] = wrap.html();
        }
      });
      return object;
    },
    execute : function (object) {
      object.selector.trigger("iv_execute_" + object.method, object);
      if (object.stop != undefined && object.stop == true) {
        return;
      }
      if (object.method == "post" || object.method == "get") {
        request_object = {};
        request_object.action = object.action;
        request_object.elements = object.elements;
        $.ajax({
          url: object.action,
          type: object.method,
          data: request_object,
        })
        .done(function(data) {
          if (object.callbacks.done != undefined) {
            object.callbacks.done(data);
          }
        })
        .fail(function(data) {
          if (object.callbacks.fail != undefined) {
            object.callbacks.fail(data);
          }
        })
        .always(function(data) {
          if (object.callbacks.always != undefined) {
            object.callbacks.always(data);
          }
        });
      }
    },
  };

  $.fn.ivent = function( method ) {

    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.ivent' );
    }

  };

})(jQuery)
