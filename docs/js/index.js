$(document).ready(function() {
    
    var links = [];
    var lis = $('.treemenu li');
    lis.each(function() {
        var link = $(this);
        var targetId = link.children('a').attr('href');
        if($(targetId).length > 0) {
            link.data('scroll-top', $(targetId).position().top);
            links.push(link);
        }
        
    });
    links.sort(function(a, b) {
        return a.data('scroll-top') - b.data('scroll-top');
    });
    window.links = links;
    $(document).scroll(function() {
        var distance = $(document).scrollTop();
        for(var i=0; i<links.length; i++) {
            if(links[i].data('scroll-top') > distance) {
                focus(links[i]);
                break;
            }
        }
    })
    function focus(ele) {
        $('.treemenu li').removeClass('focus');
        $(ele).addClass('focus');
        $($(ele).find('li')[0]).addClass('focus');
        $(ele).parent().parent().addClass('focus');
    }

    function Runner (containerId) {
        this.editor = CodeMirror.fromTextArea(document.getElementById("editor-textarea"), {
            lineNumbers: true,
            mode:  "javascript",
            theme: "mbo",
            styleActiveLine: true,
            matchBrackets: true
        });
        this.sandbox = document.getElementById('sandbox');
        this.container = document.getElementById(containerId);
    }

    Runner.prototype.setCode = function (code) {
        this.editor.setValue(code);
    }
    Runner.prototype.clearCode = function () {
        this.editor.setValue('');
    }
    Runner.prototype.show = function () {
        $(this.container).addClass('active');
    }
    Runner.prototype.hide = function () {
        $(this.container).removeClass('active');
        this.stop();
    }
    Runner.prototype.runCode = function () {
        var code = this.editor.getValue();
        this.sandbox.contentWindow.location.reload();
        this.sandbox.onload = function() {
            sandbox.contentWindow.postMessage({fn: 'exec', code: code}, "*");
            sandbox.contentWindow.document.getElementsByTagName('canvas')[0].focus();
        };
    }
    Runner.prototype.stop = function () {
        this.sandbox.contentWindow.postMessage({fn: 'stop'}, "*");
    }

    if($('#editor').length > 0) {
        var runner = new Runner('editor');
        $('.popup-content').click(function(event) {
            event.stopPropagation();
        });
        $('.js-start').click(function() {
            runner.runCode();
        });
        $('.js-stop').click(function() {
            runner.stop();
        });
        $('.js-close').click(function() {
            runner.hide();
            stop();
        });
        $('.js-example-code').click(function() {
            runner.clearCode();
            runner.show();
            var path = $(this).attr('code-path');
            $.ajax({
                url: path,
                dataType: "text",
                success: function (data) {
                    runner.setCode(data);
                }
            }).done(function() {
                runner.runCode();
            });
        });
    }

    if ($('.homepage').length > 0) {
        $('.js-example-code').click();
    }
    if ($('.document').length > 0) {
    }
    if ($('.examples').length > 0) {
    }

    var now = (location.pathname).split('/');
    if(now[now.length-1] == "docs.html"){
        // function search(text) {
        //     var pattern = text.toLowerCase();
        //     var targetId = "";
            
        //     var h3s = $("h3");
        //     for (var i = 0; i < h3s.length; i++) {
        //         var span = $(h3s[i]).find("span")[0];
        //         var index = span.innerText.toLowerCase().indexOf(pattern);
        //         if (index != -1) {
        //             targetId = span.id;
        //             location.hash = "#"+targetId;
        //             break;
        //         }
        //     }  
        // }
        $(".header").css("position", "absolute");
        $("#search, #search_btn").show();
        $("#search").on("keypress", function(e){
            if(e.keyCode == 13)
                search($(this).val());
        });
        $("#search_btn").click(function(e){
                search($("#search").val());
        });
    }

    $("#top").click(function(){
        $("body").animate({scrollTop:0}, '500');
    });

    $(window).scroll(function(){
        if($("body").prop("scrollTop") != 0)
            $("#top").fadeIn(200);
        else
            $("#top").fadeOut(200);
    });

});