module("Chain");

test("shouldLoadThreeQueries", function () {
    var query1 = new _ch.AjaxWidget(function (){console.log("loaded1")}, {url: "http://test1", body: {test: "test1"}});
    var query2 = new _ch.AjaxWidget(function (){console.log("loaded2")}, {url: "http://test2", body: {test: "test2"}});
    var query3 = new _ch.AjaxWidget(function (){console.log("loaded3")}, {async: false, url: "http://test3", body: {test: "test3"}});
    var list = [];
    list.push(query1);
    list.push(query3);
    list.push(query2);
    var chain = new _ch.AjaxChain();
    chain.add(list);
    $.mockjax({
        url: "*",
        responseText: {},
        status: 200,
        responseTime: 6000,
        isTimeout: false,
        statusText: "OK",
        proxy: '',
        lastModified: null,
        etag: ''
    });
    chain.start();
    expect(0);
});

test("shouldRenderQueries", function () {
    var query1 = new _ch.AjaxWidget(function (){console.log("loaded1")}, {url: "http://test1", body: {test: "test1"}});
    var query2 = new _ch.AjaxWidget(function (){console.log("loaded2")}, {url: "http://test2", body: {test: "test2"}});
    var query3 = new _ch.AjaxWidget(function (){console.log("loaded3")}, {async: false, url: "http://test3", body: {test: "test3"}});
    var list = [];
    list.push(query1);
    list.push(query3);
    list.push(query2);
    var chain = new _ch.AjaxChain();
    chain.add(list);
    var view = new _ch.AjaxChain.View({controller: chain});
    $('#queries').html(view.el);
    view.render();
    $.mockjax({
        url: "*",
        responseText: {},
        status: 200,
        responseTime: 6000,
        isTimeout: false,
        statusText: "OK",
        proxy: '',
        lastModified: null,
        etag: ''
    });
    chain.start();
    expect(0);
});


