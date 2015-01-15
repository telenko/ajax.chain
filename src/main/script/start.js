
$(function () {
    modifyBackboneSync();
});
_ch = {}
function modifyBackboneSync() {
    Backbone.sync = function (method, model, handler) {
        if (model.loading && model.loading.method == method) {
            model.loading.xhr.abort();
        }
        var xhr = $.ajax({
            context: handler,
            contentType: "application/json",
            data: JSON.stringify(model.attributes),
            beforeSend: handler.beforeSend,
            error: handler.error,
            success: handler.success,
            async: handler.async,
            dataType: model.contentTypeResp ? model.contentTypeResp : 'json',
            cache: false,
            method: method ? method : "POST",
            url: model.url,
            xhrFields: {
                withCredentials: true
            },
            complete: handler.complete
        });
        model.loading = {
            method: method,
            xhr: xhr
        }
    };
}
