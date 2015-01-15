_ch.AjaxChain = Backbone.View.extend({

    add: function (list) {
        this.chain = this.importChain(list);
    },

    importChain: function (list) {
        for (var i = 0; i < list.length - 1; i++) {
            if (list[i] instanceof _ch.AjaxWidget) {
                var funcCallNext = function () {
                    this.next.load();
                }
                list[i].next = list[i + 1];
                list[i].addonsActions = funcCallNext;
            } else {
                throw new Error(_ch.Common.Messages.notValidChainArguments);
            }
        }
        return list;
    },

    start: function () {
        this.startFrom(0);
    },

    startFrom: function (index) {
        this.chain[index].load();
    },

    pause: function () {
        _ch.paused = true;
    },

    resume: function () {
        _ch.paused = false;
    },

    isPaused: function () {
        return _ch.paused;
    },

    stop: function () {
        for (var i = 0; i < this.chain.length; i++) {
            if (this.chain[i].requestModel && this.chain[i].requestModel.loading) {
                this.chain[i].abortLoading();
            }
        }
        this.resume();
    }

});

_ch.AjaxChain.View = Backbone.View.extend({
    className: "chain",
    initialize: function (attributes) {
        var controller = attributes.controller;
        if (!controller instanceof _ch.AjaxChain) {
            throw new Error(_ch.Common.Messages.notValidChainController);
        }
        this.controller = controller;
    },
    template: _ch.Template.chain,
    events: {
        "click .start": function () {
            if (this.controller.isPaused()) {
               this.controller.resume();
            } else {
               this.controller.start();
            }
        },
        "click .stop": function () {
            this.controller.stop();
        },
        "click .pause": function () {
            this.controller.pause();
        }
    },
    render: function () {
        _ch.Utils.addContent(this.el, this.template);
        for (var i = 0; i < this.controller.chain.length; i++) {
            $(this.el).find("table").append(this.controller.chain[i].view.el);
            this.controller.chain[i].view.wait();
        }
    }

});
