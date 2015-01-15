_ch.Utils = {
    getContent: function (template, contentObj) {
        return contentObj ? Mustache.to_html(template, contentObj) : template;
    },
    addContent: function (selector, template, contentObj) {
        $(selector).html(this.getContent(template, contentObj));
    },
    concatFunctions: function (func1, func2) {
        var resp = function (parameters) {
            this.func1(parameters);
            this.func2();
        }
        resp.func1 = func1;
        resp.func2 = func2;
        return resp;
    }
}
