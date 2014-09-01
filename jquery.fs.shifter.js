/* 
 * Shifter v3.0.8 - 2014-09-01 
 * A jQuery plugin for simple slide-out mobile navigation. Part of the Formstone Library. 
 * http://formstone.it/shifter/ 
 * 
 * Copyright 2014 Ben Plum; MIT Licensed 
 */ 

/*
 * Shifter v3.0.5 - 2014-04-22
 * A jQuery plugin for simple slide-out mobile navigation. Part of the Formstone Library.
 * http://formstone.it/shifter/
 *
 * Copyright 2014 Ben Plum; MIT Licensed
 */

;(function ($, window) {
	"use strict";

	var initialized = false,
		hasTouched = false,
		data = {};

	/**
	 * @options
	 * @param maxWidth [string] <'980px'> "Width at which to auto-disable plugin"
	 */
	var options = {
		maxWidth: "980px"
	};

	var pub = {

		/**
		 * @method
		 * @name close
		 * @description Closes navigation if open
		 * @example $.shifter("close");
		 */
		close: function() {
			if (initialized) {
				data.$html.removeClass("shifter-open");
				data.$body.removeClass("shifter-open");
				data.$shifts.off(".shifter");
				// Close mobile keyboard if open
				data.$nav.find("input").trigger("blur");
			}
		},

		/**
		 * @method
		 * @name enable
		 * @description Enables navigation system
		 * @example $.shifter("enable");
		 */
		enable: function() {
			if (initialized) {
				data.$body.addClass("shifter-active");
			}
		},

		/**
		 * @method
		 * @name defaults
		 * @description Sets default plugin options
		 * @param opts [object] <{}> "Options object"
		 * @example $.shifter("defaults", opts);
		 */
		defaults: function(opts) {
			options = $.extend(options, opts || {});
		},

		/**
		 * @method
		 * @name destroy
		 * @description Removes instance of plugin
		 * @example $.shifter("destroy");
		 */
		destroy: function() {
			if (initialized) {
				data.$html.removeClass("shifter-open");
				data.$body.removeClass("shifter shifter-active shifter-open")
					      .off("touchstart.shifter click.shifter");

				// Navtive MQ Support
				if (window.matchMedia !== undefined) {
					data.mediaQuery.removeListener(_onRespond);
				}

				data = {};
			}
		},

		/**
		 * @method
		 * @name disable
		 * @description Disables navigation system
		 * @example $.shifter("disable");
		 */
		disable: function() {
			if (initialized) {
				data.$body.removeClass("shifter-active");
			}
		},

		/**
		 * @method
		 * @name open
		 * @description Opens navigation if closed
		 * @example $.shifter("open");
		 */
		open: function() {
			if (initialized) {
				data.$html.addClass("shifter-open");
				data.$body.addClass("shifter-open");
				data.$shifts.one("touchstart.shifter click.shifter", _onClick);
			}
		}
	};

	/**
	 * @method private
	 * @name _init
	 * @description Initializes plugin
	 * @param opts [object] "Initialization options"
	 */
	function _init(opts) {
		if (!initialized) {
			options = $.extend(options, opts || {});

			data.$html = $("html");
			data.$body = $("body");
			data.$shifts = $(".shifter-header, .shifter-page");
			data.$nav  = $(".shifter-navigation");

			if (data.$shifts.length > 0 && data.$nav.length > 0) {
				initialized = true;

				data.$body.addClass("shifter")
						  .on("touchstart.shifter click.shifter", ".shifter-handle", _onClick);

				// Navtive MQ Support
				if (window.matchMedia !== undefined) {
					data.mediaQuery = window.matchMedia("(max-width:" + (options.maxWidth === Infinity ? "100000px" : options.maxWidth) + ")");
					data.mediaQuery.addListener(_onRespond);
					_onRespond();
				}
			}
		}
	}

	/**
	 * @method private
	 * @name _onRespond
	 * @description Handles media query match change
	 */
	function _onRespond() {
		if (data.mediaQuery.matches) {
			pub.enable();
		} else {
			pub.disable();
		}
	}

	/**
	 * @method private
	 * @name _onClick
	 * @description Determines proper click / touch action
	 * @param e [object] "Event data"
	 */
	function _onClick(e) {
		e.preventDefault();
		e.stopPropagation();

		if (!hasTouched) {
			if (data.$body.hasClass("shifter-open")) {
				pub.close();
			} else {
				pub.open();
			}
		}

		if (e.type === "touchstart") {
			hasTouched = true;

			setTimeout(_resetTouch, 500);
		}
	}

	/**
	 * @method private
	 * @name _resetTouch
	 * @description Resets touch state
	 */
	function _resetTouch() {
		hasTouched = false;
	}

	$.shifter = function(method) {
		if (pub[method]) {
			return pub[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return _init.apply(this, arguments);
		}
		return this;
	};
})(jQuery, window);