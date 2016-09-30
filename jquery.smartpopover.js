/*!
 * jQuery SmartPopover - Auto layouting balloon popover always inside window.
 * (c) 2013 mofukuma <twitter:@mofukuma>
 * MIT Licensed.
 *
 * http://kumaden.grrr.jp/
 * https://github.com/mofukuma/jquery.smartpopover
 */

/** 
 - 常に画面外にはみ出さない吹き出しを出すプラグイン

 ex.)
     $( ).smartPopover("<div>html...</div>"); 

     $( ).smartPopover("<div>html...</div>", {"background-color":#333}); 
     
     $( ).smartPopover("destroy"); 
*/

(function($) {
    var undefined;

    $.smartPopover = {
        version: "0.8"
    };

    $.fn.smartPopover = function(html, opt) {
        var target = this;

        var destroy = function(e) {
            if (e && e.target && 
                $(e.target).parents().addBack().filter(".js-smartpopover,.js-smartpopover-target").length > 0 )
                     return;

            $(target).removeClass("js-smartpopover-target");
            $(target).off("mousemove", onresize);
            $(window).off("resize scroll", onresize);
            $(target).off("redraw", onresize);
            $(document).off("mousedown", destroy);
            $(".js-smartpopover").fadeOut(100, function() {
                $(this).remove()
            });
        };

        // 削除
        if (html === "destroy") {
            destroy();
            return this;
        }

        //オプションの処理
        opt = opt || {};

        var always = opt.always || true; //常に画面内に
        var arrowsize = opt.arrowsize || 12; //矢印の大きさ
        var arrowwidth = opt.arrowwidth || 12; //矢印の横幅
        var arrowmargin = opt.arrowmargin || 1; //矢印の指す場所からの位置
        var bgcolor = opt["background-color"] || "#f5f5f5"; //吹き出しの色
        var bgcolor2 = opt["background-color2"] || bgcolor; //吹き出しの色グラデーション
        var borderradius = (opt["border-radius"] !== undefined) ? opt["border-radius"] : "4px"; //丸み
        var arrowcolor = opt["arrow-color"] || bgcolor; //吹き出し矢印の色
        var margin = opt.margin || {w: 24, h: 24 }; //吹き出しのマージン
        var only = (opt.only !== undefined) ? opt.only : true; //1つの吹き出しのみ
        var outerclickclose =
            (opt.outerclickclose !== undefined) ? opt.outerclickclose : true; //吹き出し外をクリックで閉じる
        var zindex = ("z-index" in opt) ? opt["z-index"] : 10000;

        //既に出ている吹き出しを削除
        if (only) $(".js-smartpopover-target").smartPopover("destroy");

        $(target).addClass("js-smartpopover-target");

        //ベースDIVをbodyに追加
        var root = $("<div/>").addClass("js-smartpopover")
            .css({
                position: "absolute",
                left: 0,
                top: 0,
                overflow: "visible",
                "z-index": zindex
            })
            .appendTo("body");

        var popdom = $(html).css({
            position: "absolute",
            opacity: 0.01
        }).appendTo("body");

        //実測
        var pop = {
            w: popdom.outerWidth(true),
            h: popdom.outerHeight(true)
        };
        popdom.hide();
        popdom.remove().appendTo(root);

        //枠を作る
        var of = $(target).offset();
        var popwin = $("<div/>")
            .css({
                position: "absolute",
                left: of.left - pop.w / 2,
                top: of.top - pop.h / 2,
                overflow: "auto",
                width: pop.w + margin.w * 2,
                height: pop.h + margin.h * 2,
                "background-color": bgcolor,
                "border-radius": borderradius,
                "text-shadow": "1px -1px rgba(0, 0, 0, .1)",
                "box-sizing": "border-box",
                border: "1px solid rgba(0, 0, 0, .1)",
                "box-shadow": '3px 3px 3px rgba(0, 0, 0, .08), 1px 1px 0 rgba(255, 255, 255, .13) inset',
                "background-image": "linear-gradient(" + bgcolor + " 0," + bgcolor2 + " 100%)",
            })
            .appendTo(root);
        popdom.css({
            left: margin.w,
            top: margin.h,
            opacity: 1
        }).appendTo(popwin).show();

        pop.w = pop.w + margin.w * 2;
        pop.h = pop.h + margin.h * 2;

        var poporg = {
            w: pop.w,
            h: pop.h
        };

        //矢印をつくる
        var arrow = arrowsize + arrowmargin;
        var arrowcss = [];
        var acolor = [arrowcolor, "rgba(0, 0, 0, .2)"];
        for (var i = 0; i < 2; i++) {
            var tb = (arrowwidth) + "px solid transparent";
            var cb = (arrowsize) + "px solid " + acolor[i];
            arrowcss[i] = { //右の時は左に出す
                left: {
                    "border-left": cb,
                    "border-top": tb,
                    "border-bottom": tb,
                    "border-right": "",
                    "left": -1 * arrow - 2 + i,
                    "top": -1 * arrowwidth,
                },
                right: {
                    "border-left": "",
                    "border-top": tb,
                    "border-bottom": tb,
                    "border-right": cb,
                    "left": arrowmargin + 2 - i,
                    "top": -1 * arrowwidth,
                },
                bottom: {
                    "border-left": tb,
                    "border-top": "",
                    "border-bottom": cb,
                    "border-right": tb,
                    "left": -1 * arrowwidth,
                    "top": arrowmargin + 2 - i,
                },
                top: {
                    "border-left": tb,
                    "border-top": cb,
                    "border-bottom": "",
                    "border-right": tb,
                    "left": -1 * arrowwidth,
                    "top": -1 * arrow - 2 + i,
                }
            };
        }
        var arrowwrap = $("<div/>").css({
            position: "absolute",
            "z-index": zindex + 1,
        }).prependTo(root);

        var arrowdom = $("<div/>").css({
            position: "absolute",
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            "z-index": zindex + 3,
        }).appendTo(arrowwrap);

        var arrowdom2 = $("<div/>").css({
            position: "absolute",
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            "z-index": zindex + 2,
        }).appendTo(arrowwrap);


        var oldt = {}, oldwin = {};
        root.hide();

        var onresize = function() {
            of = $(target).offset();
            var t = {
                x: of.left,
                y: of.top,
                w: $(target).width(),
                h: $(target).height()
            };
            var win = {
                x: $(window).scrollLeft(),
                y: $(window).scrollTop(),
                w: $(window).width(),
                h: $(window).height()
            };

            if (oldt.x === t.x && oldt.y === t.y && oldt.w === t.w && oldt.h === t.h &&
                oldwin.x === win.x && oldwin.y === win.y && oldwin.w === win.w && oldwin.h === win.h
            ) {
                return;
            }
            oldt = t;
            oldwin = win;

            var points = {
                left: {
                    x: t.x,
                    y: t.y + t.h / 2
                },
                right: {
                    x: t.x + t.w,
                    y: t.y + t.h / 2
                },
                top: {
                    x: t.x + t.w / 2,
                    y: t.y
                },
                bottom: {
                    x: t.x + t.w / 2,
                    y: t.y + t.h
                }
            };

            var winmargin = arrowwidth*2 +4;
            $.each(points, function(k, v) {
                points[k].x = (v.x > win.x + win.w - winmargin) ? win.x + win.w - winmargin:
                    (v.x < win.x + winmargin) ? win.x + winmargin : v.x;
                points[k].y = (v.y > win.y + win.h - winmargin) ? win.y + win.h - winmargin:
                    (v.y < win.y + winmargin) ? win.y + winmargin : v.y;

            });

            //そもそも入るか
            var widthin = win.w - poporg.w > 0;
            var heightin = win.h - poporg.h > 0;
            var canplaced = widthin && heightin;
            //入らない場合、スクロールとする
            pop.w = (!widthin) ? win.w : poporg.w;
            pop.h = (!heightin) ? win.h : poporg.h;
            popwin.css({
                width: pop.w,
                height: pop.h
            });

            var r = {
                left: {
                    p: points.left.x - win.x - pop.w - arrow
                },
                right: {
                    p: win.x + win.w - points.right.x - pop.w - arrow
                },
                top: {
                    p: points.top.y - win.y - pop.h - arrow
                },
                bottom: {
                    p: win.y + win.h - points.bottom.y - pop.h - arrow
                }
            };

            r.left.ok = r.left.p > 0; //左に入るか
            r.right.ok = r.right.p > 0;
            r.top.ok = r.top.p > 0;
            r.bottom.ok = r.bottom.p > 0;

            var best = null;
            var bestp = 0;
            $.each(r, function(k, v) {
                if (v.ok && bestp < v.p) {
                    best = k;
                    bestp = v.p;
                }
            });

            if (best === null) {
                //どこにも入らない妥協モード
                bestp = -9999999;
                $.each(r, function(k, v) {
                    if (bestp < v.p) {
                        best = k;
                        bestp = v.p;
                    }
                });
            }

            var point = points[best];

            var placed = {};

            switch (best) {
                case "top":
                    placed.x = point.x - pop.w / 2;
                    placed.y = point.y - (pop.h + arrow);
                    break;
                case "bottom":
                    placed.x = point.x - pop.w / 2;
                    placed.y = point.y + arrow;
                    break;
                case "left":
                    placed.x = point.x - (pop.w + arrow);
                    placed.y = point.y - pop.h / 2;
                    break;
                case "right":
                    placed.x = point.x + arrow;
                    placed.y = point.y - pop.h / 2;
                    break;
            }

            //はみ出し修正
            winmargin = arrowwidth;
            placed.y = (placed.y + pop.h > win.y + win.h - winmargin) ? placed.y - (placed.y + pop.h - (win.y + win.h - winmargin)) :
                (placed.y < win.y + winmargin) ? win.y + winmargin : placed.y;
            placed.x = (placed.x + pop.w > win.x + win.w - winmargin) ? placed.x - (placed.x + pop.w - (win.x + win.w - winmargin)) :
                (placed.x < win.x + winmargin) ? win.x + winmargin : placed.x;

            popwin.css({
                left: placed.x,
                top: placed.y
            });

            //矢印の配置
            var arrowp = {};
            switch (best) {
                case "left": //arrow -> right
                    arrowp.x = placed.x + pop.w + arrow;
                    arrowp.y = point.y;
                    break;
                case "right":
                    arrowp.x = placed.x - arrow;
                    arrowp.y = point.y;
                    break;
                case "top":
                    arrowp.x = point.x;
                    arrowp.y = placed.y + pop.h + arrow;
                    break;
                case "bottom":
                    arrowp.x = point.x;
                    arrowp.y = placed.y - arrow;
                    break;
            }
            arrowdom.css(arrowcss[0][best]);
            arrowdom2.css(arrowcss[1][best]);
            arrowwrap
                .css({
                    x: arrowp.x,
                    y: arrowp.y
                });

        }

        root.fadeIn(100);
        onresize();

        if (always) {
            $(window).on("resize scroll", onresize);
            $(document).on("mousemove", onresize);
            $(target).on("redraw", onresize);
        }
        if (outerclickclose) {
            $(document).on("mousedown", destroy);
        }

    };
})(jQuery);
