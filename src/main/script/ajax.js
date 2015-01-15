_ch.AjaxWidget = Backbone.View.extend({

    methodType: _ch.Common.Ajax.methodType.post,
    xhrObject: null,

    errorTemplate: _ch.Template.error,
    errorMessage: _ch.Common.Messages.error,
    loadAddonsIfFail: true,
    showDefaultError: true,
    async: true,
    delayPeriod: 500,

    initialize: function (onEndFunc, paramsMap) {
        if (typeof onEndFunc === "function") {
            this.onEndFunc = onEndFunc;
        }
        for (var key in paramsMap) {
            this[key] = paramsMap[key];
        }
        if (!this.url) {
            throw new Error(_ch.Common.Messages.noUrlInAjaxConstructor);
        }
        this.model = new _ch.AjaxWidget.Model();
        this.view = new _ch.AjaxWidget.View({controller: this});
        this.listenModel();
        this.model.wait();
    },

    beforeSend: function () {
        $(this.el).html(_ch.Template.loader);
    },

    success: function (data, statusText, xhr) {
        console.log("success");
        var currentContent = this;
        this.successTimer = setInterval(function () {
            if (_ch.paused) {
                currentContent.model.pause();
                return false;
            }
            currentContent.successHandler(data);
            clearInterval(currentContent.successTimer);
            currentContent.model.pass();
        }, this.delayPeriod);
    },
    successHandler: function (data) {
        console.log("successHandler");
        if (typeof this.onEndFunc === "function") {
            this.onEndFunc(data);
        }
        else {
            this.showError(_ch.Common.Messages.handlerNotSpecified);
        }
        if (this.async) {
            this.addonsActions();
        }
    },
    prepareRequestModel: function () {
        this.requestModel = new Backbone.Model();
        this.requestModel.attributes = this.body;
        this.requestModel.url = this.url;
    },
    buildResponseModel: function (responseObject) {
        //default
    },
    error: function (xhr, statusText, err) {
        var currentContent = this;
        this.errorTimer = setInterval(function () {
            if (_ch.paused) {
                currentContent.model.pause();
                return false;
            }
            currentContent.errorHandler(xhr, statusText, err);
            clearInterval(currentContent.errorTimer);
        }, this.delayPeriod);
    },

    errorHandler: function (xhr, statusText, err) {
        if (statusText === "abort") {
            this.abortHandler();
            return false;
        }
        this.hideLoading();
        var message = this.showDefaultError ? this.errorMessage : err;
        this.showError(message);
        if (this.loadAddonsIfFail && this.async) {
            this.addonsActions();
        }
        this.model.fail();
    },
    abortHandler: function () {
        console.log("abort");
    },
    clear: function () {
        $(this.el).empty();
    },

    getRequestModel: function () {
        return this.requestModel;
    },

    close: function () {
        this.unbind();
        this.remove();
    },

    complete: function () {
        this.hideLoading();
    },

    showError: function (errorMessage) {
        var selector = this.errorSelector ? this.errorSelector : this.el;
        _ch.Utils.addContent(selector, this.errorTemplate, this.errorMessage);
    },

    load: function () {
        console.log("starting loading");
        this.prepareRequestModel();
        Backbone.sync(this.methodType, this.getRequestModel(), this);
        this.model.process();
        if (!this.async) {
            this.addonsActions();
        }
    },
    addonsActions: function () {
    },
    hideLoading: function () {
        //todo add hiding anim
    },
    hideView: function () {
        $(this.el).hide();
    },
    abortLoading: function () {
        if (this.requestModel && this.requestModel.loading) {
            this.requestModel.loading.xhr.abort();
            this.model.stop();
        }
    },
    listenModel: function () {
        var currentContent = this;
        this.model.on("change:state", function () {
            var state = this.getState();
            var view = currentContent.view;
            if (state === _ch.Common.Ajax.state.fail) {
                view.fail();
            } else if (state === _ch.Common.Ajax.state.pass) {
                view.pass();
            } else if (state === _ch.Common.Ajax.state.process) {
                view.process();
            } else if (state === _ch.Common.Ajax.state.pause) {
                view.pause();
            } else if (state === _ch.Common.Ajax.state.stop) {
                view.stop();
            } else {
                view.wait();
            }
        });
    }

});

_ch.AjaxWidget.View = Backbone.View.extend({
    tagName: "tr",
    className: "ajax-view",
    initialize: function (attributes) {
        var controller = attributes.controller;
        if (!controller instanceof _ch.AjaxWidget) {
            throw new Error(_ch.Common.Messages.notValidAjaxController);
        }
        this.controller = controller;
    },
    template: _ch.Template.ajax,
    wait: function () {
        _ch.Utils.addContent(this.el, this.template, this.controller);
    },
    pass: function () {
        $(this.el).css("background-color", "rgb(70, 205, 70)");
    },
    process: function () {
        $(this.el).css("background-color", "rgb(224, 224, 57)");
    },
    pause: function () {
        $(this.el).css("background-color", "rgb(210, 224, 230)");
    },
    fail: function () {
        $(this.el).css("background-color", "rgb(221, 66, 66)");
    },
    stop: function () {
        $(this.el).css("background-color", "rgb(107, 107, 107)");
    }

});

_ch.AjaxWidget.Model = Backbone.Model.extend({
    defaults: {
        state: _ch.Common.Ajax.state.wait
    },
    wait: function () {
        this.setState(_ch.Common.Ajax.state.wait)
    },
    fail: function () {
        this.setState(_ch.Common.Ajax.state.fail)
    },
    pause: function () {
        this.setState(_ch.Common.Ajax.state.pause)
    },
    process: function () {
        this.setState(_ch.Common.Ajax.state.process)
    },
    pass: function () {
        this.setState(_ch.Common.Ajax.state.pass);
    },
    stop: function () {
        this.setState(_ch.Common.Ajax.state.stop);
    },
    getState: function () {
        return this.get('state');
    },
    setState: function (state) {
        this.set('state', state);
    }
});
