var screenshotReady, screenshotUrl;
debug = !1;
var oldfilter = "rape|incest|nazi|racist|dicks|bait|small|girl|boy|teen|child|loli|kids|beating";
$.ajaxSetup({
    error: function() {
        ajaxBusy = !1
    }
});
Array.indexOf || (Array.prototype.indexOf = function(b) {
    for (var a = 0; a < this.length; a++)
        if (this[a] == b) return a;
    return -1
});

function sortDescending(b, a) {
    return parseInt($(b).attr("data-rank")) < parseInt($(a).attr("data-rank")) ? -1 : 1
}

function eH(b) {
    return b ? b.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;") : ""
}
var urlParams = {};
(function() {
    for (var b, a = /\+/g, c = /([^&=]+)=?([^&]*)/g, d = window.location.search.substring(1); b = c.exec(d);) urlParams[decodeURIComponent(b[1].replace(a, " "))] = decodeURIComponent(b[2].replace(a, " "))
})();

function upL(b) {
    return b.charAt(0).toUpperCase() + b.slice(1)
}
Array.prototype.last || (Array.prototype.last = function() {
    return this[this.length - 1]
});
var regexYoutube = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i,
    regexThumb = /(\.png|\.jpg|\.jpeg|\.gif)$/i,
    regexFlickr = /\/([0-9]{10,})/,
    regexVimeo = /http:\/\/(www\.)?vimeo\.com\/(.*\/)?(\d+)/,
    intervalUpdates = 15E3,
    newWidth, columns;
if ("" != urlParams.r && null != urlParams.r) var subreddit = "/new" == urlParams.r ? "all/new/" : urlParams.r,
    subreddit = subreddit.replace(/\/?r\//, ""),
    newPart = urlParams.r.match(/\/new\/?/i) ? "&sort=new" : "",
    redditUrl = "http://www.reddit.com/r/" + eH(subreddit) + newPart,
    redditUrl = redditUrl.replace(" ", "+");
else redditUrl = "http://www.reddit.com/";
if ("1" == urlParams.nsfw || "on" == urlParams.nsfw || "true" == $.cookie("nsfw")) var nsfw = ' checked="checked"',
    nsfwToggle = !0;
else nsfw = "", nsfwToggle = !1;
if ("0" == urlParams.zoom || "off" == urlParams.zoom || "false" == $.cookie("zoom")) var zoom = "",
    zoomToggle = !1;
else zoom = ' checked="checked"', zoomToggle = !0;
if ("1" == urlParams.autoAdd || "on" == urlParams.autoAdd || "true" == $.cookie("autoAdd")) var aaCheck = ' checked="checked"',
    refreshAutoadd = !0;
else aaCheck = "", refreshAutoadd = !1;
if ("1" == urlParams.aniOff || "on" == urlParams.aniOff || "true" == $.cookie("aniOff") || "false" != $.cookie("aniOff") && /android|iphone|ipod|series60|symbian|windows ce|blackberry/i.test(navigator.userAgent)) var aniCheck = ' checked="checked"',
    aniToggle = !0;
else aniCheck = "", aniToggle = !1;
var limit = /android|iphone|ipod|series60|symbian|windows ce|blackberry/i.test(navigator.userAgent) ? 20 : 50,
    urlsRendered = [],
    dataAfter = "",
    refresher, ajaxBusy = !1,
    ajaxBusyRefresh = !1,
    endReached = !1,
    firstRender = !0,
    rank = 0,
    limitRender = 10,
    renderCount = 0,
    renderCountTotal = 0,
    adsTotal = 0,
    positionNew = 1,
    refreshBoxes = [],
    boxType = "box",
    tenSecondsPassed = !1;
setTimeout(function() {
    tenSecondsPassed = true
}, 15E3);
aniToggle && (boxType = "boxFast");
document.write('<div id="container" class="transitions-enabled infinite-scroll clearfix"></div><div id="loadingNew"><img alt="Loading..." src="scrolldit/img/loaderNew.gif" id="loaderNew"><div id="loadingText"><span id="checkText">Checking new posts</span><span id="add"><br>[Add]</span> <span id="autoAdd">[Auto add]</span></div><img alt="Stop" src="scrolldit/img/stop.png" id="stop" title="Stop the check for new posts"></div><div id="loading"><img alt="Loading..." src="scrolldit/img/loader.gif" id="loader"><div><em>Loading posts</em></div></div>');
var $container = $("#container"),
    $loadingNew = $("#loadingNew"),
    $loading = $("#loading"),
    $loaderNew = $("#loaderNew");
$(window).resize(function() {
    columns = Math.floor($container.width() / $("." + boxType).outerWidth(true))
});
aniToggle ? $container.masonry({
    itemSelector: ".boxFast",
    isAnimated: !1
}) : $container.masonry({
    itemSelector: ".box",
    isAnimated: !Modernizr.csstransitions
});
newWidth = boxWidth(0);

function fetchSubreddits(b, a, c) {
    var d = false;
    Modernizr.localstorage && (localStorage.getItem("subreddits") && localStorage.getItem("subreddits").length > 0) && (d = true);
    if (!c && !d) {
        a = a || [];
        c = (b = b || "") ? "http://www.reddit.com/reddits/.json?sort=hot&limit=500&after=" + b : "http://www.reddit.com/reddits/.json?sort=hot&limit=500";
        if (!b && a.length > 0) {
            fetchSubreddits(false, a, true);
            return true
        }
        $.ajax({
            url: c,
            data: {
                after: b
            },
            callback: "jsonp",
            dataType: "jsonp",
            jsonp: "jsonp",
            cache: true,
            success: function(b) {
                if (b.data != null)
                    if (b.data.children) {
                        $.merge(a, b.data.children);
                        a.length < 400 ? fetchSubreddits(b.data.after, a, false) : fetchSubreddits(false, a, false)
                    } else fetchSubreddits(false, a, false)
            }
        })
    } else {
        if (d) {
            a = JSON.parse(localStorage.getItem("subreddits"));
            b = '<option value="disabled">Browse</option><option value="/r/all">View Frontpage</option><option value="subreddits">View Subreddits</option><option value="disabled">-------</option>';
            for (i = 0; i <= a.length - 1; i++) b = b + ('<option value="' + eH(a[i].url) + '">' + eH(upL(a[i].name)) + "</option>")
        } else {
            c = [];
            b = '<option value="disabled">Browse</option><option value="/r/all">View Frontpage</option><option value="subreddits">View Subreddits</option><option value="disabled">-------</option>';
            for (i = 0; i <= a.length - 1; i++)
                //if (a[i].data && !a[i].data.url.match(/(qwertyuiopasdfghjklzxcvbnm)/i) && !a[i].data.title.match(/(qwertyuiopasdfghjklzxcvbnm)/i)) {
                if (a[i].data) {
                    c.push({
                        url: eH(a[i].data.url),
                        name: eH(a[i].data.display_name)
                    });
                    b = b + ('<option value="' + eH(a[i].data.url) + '">' + eH(upL(a[i].data.display_name)) + "</option>")
                } Modernizr.localstorage && localStorage.setItem("subreddits", JSON.stringify(c))
        }
        $("#browseDropdown").html("");
        $("#browseDropdown").append(b);
        urlParams.r != "" && urlParams.r != null && $("#browseDropdown").val(urlParams.r);
        $("#browseDropdown").change(function() {
            if ($(this).val() != "disabled") window.location.href = $(this).val() == "subreddits" ? "http://" + window.location.host + "/?t=subreddits" : "http://" + window.location.host + "/?r=" + $(this).val()
        });
        $("#browseDropdown").fadeIn()
    }
}
var item = document.createElement("div");
item.className = boxType + " reddit";
$(item).attr("data-rank", "-2");
item.innerHTML = '<div id="logobox"><a href="' + redditUrl + '" target="_blank"><img src="scrolldit/img/logo2.png" id="logo"><img src="scrolldit/img/logo2-hover.png" id="logo-hover"></a></div><div id="browse"><select id="browseDropdown"><option value="disabled">Loading...</option></select><form method="get" action="" id="subR"><input type="text" name="r" id="r" placeholder="Subreddit" title="Fill in a subreddit and press enter!"></form></div></div><div id="controls"><input type="checkbox" name="nsfw" id="nsfw"' + nsfw + ' title="Toggle for NSFW content"><label for="nsfw" id="nsfwlabel" title="Toggle for NSFW content">NSFW</label><div class="addthis_toolbox addthis_default_style" addthis:title="ScrollDit.com" addthis:description="Scroll Reddit!"><a class="addthis_button_facebook"></a><a class="addthis_button_twitter"></a><a class="addthis_button_email"></a><a class="addthis_button_compact"></a></div><a id="zoomIn" href="#" onclick="zoomBox(-1);return false;" title="Zoom in! Trick: press + on keyboard."><img src="scrolldit/img/zmin.png"></a>&nbsp;<a id="zoomOut" href="#" onclick="zoomBox(1);return false;" title="Zoom out! Trick: press - on keyboard."><img src="scrolldit/img/zmout.png"></a></div><div id="menu"><a href="http://www.scrolldit.com/">This is just a copy to the original!</a>/<a href="?t=about">About</a>/<a href="?t=press">Press</a><div id="notice">This site is not operated by, sponsored by, endorsed by, or affiliated with Reddit in any way. All content shown is stored and provided by Reddit.com, Scrolldit is merely a new interface to browse Reddit.</div></div>';
$(item).css("width", newWidth);
$container.append($(item)).masonry("appended", $(item));
$("#r").val(urlParams.r);
$("#logobox").hover(function() {
    $("#logo-hover").stop(true, true);
    $("#logo-hover").fadeIn("fast")
}, function() {
    $("#logo-hover").fadeOut("fast")
});
$(window).load(function() {
    window.addthis.ost = 0;
    window.addthis.ready()
});
if ("" != urlParams.r && null != urlParams.r) {
    var subreddit = urlParams.r.replace(/\/$/, "").replace(/\/new$/i, "").replace(/\/controversial$/i, "").replace(/\/top$/i, "").replace(/\/hot$/i, ""),
        positionNew = 2,
        item = document.createElement("div");
    item.className = boxType + " subreddit";
    $(item).attr("data-rank", "-1");
    item.innerHTML = "<h1>Showing " + eH(urlParams.r).replace(" ", "+") + '</h1><a href="?r=' + eH(subreddit).replace(" ", "+") + '">Hot</a> / <a href="?r=' + eH(subreddit).replace(" ", "+") + '/new/">New</a> / <a href="?r=' + eH(subreddit).replace(" ", "+") + '/controversial/">Controversial</a> / <a href="?r=' + eH(subreddit).replace(" ", "+") + '/top/">Top</a>';
    $(item).css("width", newWidth);
    $container.append($(item)).masonry("appended", $(item))
}
fetchSubreddits();

function renderPress() {
    if (!endReached) {
        var b = [],
            a = document.createElement("div");
        a.className = boxType + " photo";
        a.innerHTML = '<a href="http://techcrunch.com/2011/10/25/scrolldit-i-heard-you-liked-scrolling-reddit-so-i-put-scrolling-in-your-reddit/" target="_blank">TechCrunch<img src="http://i.imgur.com/WLmcX.jpg"></a>';
        b.push(a);
        a = document.createElement("div");
        a.className = boxType + " photo";
        a.innerHTML = '<a href="http://www.dailydot.com/culture/scrolldit-image-interface-reddit-jonathan-bouman" target="_blank">The Daily Dot<img src="http://i.imgur.com/iqK0E.jpg"></a>';
        b.push(a);
        a = document.createElement("div");
        a.className = boxType + " photo";
        a.innerHTML = '<a href="http://news.ycombinator.com/item?id=3196766" target="_blank">Hacker News<img src="http://i.imgur.com/FNCrk.jpg"></a>';
        b.push(a);
        a = document.createElement("div");
        a.className = boxType + " photo";
        a.innerHTML = 'Twitter<a href="http://twitter.com/#!/kevinrose/status/128906761414512641" target="_blank" title="Founder of Digg.com"><img src="http://i.imgur.com/GhT27.jpg"></a><br><a href="http://twitter.com/#!/kn0thing/status/128959048556085248" target="_blank" title="Reddit.com Cofounder"><img src="http://i.imgur.com/VahHf.jpg"></a><br><a href="http://twitter.com/#!/9to5mac/status/128930261860745216" target="_blank"><img src="http://i.imgur.com/2bE5z.jpg"></a>';
        b.push(a);
        a = document.createElement("div");
        a.className = boxType + " photo";
        a.innerHTML = 'Dutch Press<a href="http://www.bright.nl/sneller-door-reddit-met-scrolldit" target="_blank" title="Bright.nl"><img src="http://i.imgur.com/TP5tK.jpg"></a><br><a href="http://925.nl/archief/2011/10/26/nederlandse-student-gaat-viral-vanaf-zolderkamer" target="_blank" title="925.nl"><img src="http://i.imgur.com/oFenW.jpg"></a>';
        b.push(a);
        a = document.createElement("div");
        a.className = boxType + " photo";
        a.innerHTML = '<a href="http://www.reddit.com/r/pics/comments/larwj/i_built_you_rpics_on_steroids/" target="_blank">Reddit.com/r/Pics<img src="http://i.imgur.com/LYsB8.jpg"></a>';
        b.push(a);
        var c = "<div class='topbar'><span>Spread the word! <a href='https://www.facebook.com/apps/application.php?id=168213553267018' target='_blank'>Like us!</a></span></div><iframe src='//www.facebook.com/plugins/likebox.php?href=https://www.facebook.com/pages/ScrollDitcom/285055818212877&amp;width=" + newWidth + "&amp;height=258&amp;colorscheme=light&amp;show_faces=true&amp;border_color=%23FFFFFF&amp;stream=false&amp;header=false&amp;appId=168213553267018' scrolling='no' frameborder='0' class='likeBox' width='" + newWidth + "' allowTransparency='true'></iframe>",
            a = document.createElement("div");
        a.className = boxType + " currentUser";
        a.innerHTML = c;
        b.push(a);
        $(b).css({
            opacity: 0
        });
        var d = [];
        $(b).each(function(b, a) {
            d.push(a);
            if (d.length > 2) {
                var c = d;
                $(c).imagesLoaded(function() {
                    $(c).css({
                        opacity: 1
                    });
                    newWidth > 0 && $(c).each(function(b, a) {
                        $(a).css("width", newWidth);
                        $(a).find("img").css("width", newWidth)
                    });
                    $container.append($(c)).masonry("appended", $(c));
                    $("#container").masonry("reload");
                    console.log("bam 2!")
                });
                d = []
            }
        })
    }
}

function renderAbout() {
    if (!endReached) {
        var b = [],
            a = document.createElement("div");
        a.className = boxType + " photo";
        a.innerHTML = '<h1>Crafted by Jonathan Bouman</h1><a href="http://protozoan.nl" target="_blank"><img src="scrolldit/img/me.jpg" class="photo"></a>';
        b.push(a);
        a = document.createElement("div");
        a.className = boxType;
        a.innerHTML = "<h1>Why</h1><ul><li>I love crafting mashups.</li><li>I love endless scrolling.</li><li>I lurk Reddit.</li><li><br>A way of doing something back.</li></ul>";
        b.push(a);
        a = document.createElement("div");
        a.className = boxType;
        a.innerHTML = "<h1>Concept</h1>Create a new way of browsing reddit.";
        b.push(a);
        a = document.createElement("div");
        a.className = boxType;
        a.innerHTML = '<h1>Settings</h1><input type="checkbox" name="zoomer" id="zoomer"' + zoom + ' title="Toggle for image zoom"><label for="zoomer" id="zoomerlabel" title="Toggle for image zoom"> Toggle Image zoom</label><br><input type="checkbox" name="autoadder" id="autoadder"' + aaCheck + ' title="Toggle for auto add of posts after refresh"><label for="autoadder" id="autoadder" title="Toggle for auto add of posts after refresh"> Toggle auto add new posts</label><br><input type="checkbox" name="animations" id="animations"' + aniCheck + ' title="Toggle for disable box animations"><label for="animations" id="animations" title="Toggle for  disable box animations"> Toggle disable box animations</label>';
        b.push(a);
        a = document.createElement("div");
        a.className = boxType + " changelog";
        a.innerHTML = '<h1>Changelog</h1><ul><li><h2>26-12-11</h2>Disable animation toggle. Animations disabled by default on mobile devices. Rewrote box width code.</li><li><h2>18-12-11</h2>Auto Add is optional. Changed Feedback url. Faster display of posts. Leaner code. IE7 bug fixes.</li><li><h2>11-12-11</h2>Rewrote large part of the codebase. Improved performance. Lightbox support. Better column scaling. Cookie support.</li><li><h2>02-11-11</h2>Huge performance fix for embedded media. Support Youtube / Vimeo / Soundcloud HTML5 render (iPhone/iPad support!)</li><li><h2>24-10-11</h2>Added Screenshots for external URLS (<a href="http://PagePeeker.com" target="_blank">PagePeeker.com</a>)</li><li><h2>21-10-11</h2>Packed files / Fixed bugs</li><li><h2>18-10-11</h2>Add Fullscreen Youtube (Dbl click) / Add auto check for new top posts every 30 seconds</li><li><h2>17-10-11</h2>Add Voting</li><li><h2>14-10-11</h2>XSS Bugfix</li><li><h2>13-10-11</h2>Fixed Mobile bug / New NSFW toggle / Fixed Imgur bug</li><li><h2>12-10-11</h2>Fixed Flickr support (Check <a href="/?r=itookapicture">/itookapicture</a>)</li><li><h2>12-10-11</h2>Released</li></ul>';
        b.push(a);
        a = document.createElement("div");
        a.className = boxType;
        a.innerHTML = "<h1>How it works</h1> <ol><li>1. Let the browser fetch new posts from Reddit.com (JSON API)</li><li><br>2. Renders it with the jQuery Masonry plugin (fix endless scroll and image/video preview)</li><li><br>3. Support Reddit by adding their ads</li></ol>";
        b.push(a);
        a = document.createElement("div");
        a.className = boxType;
        a.innerHTML = "<h1>Scalable</h1><ul><li>Browser does the heavy lifting, it connects directly with Reddit.com and renders the data on the fly.</li><li><br>All the static files are served by Amazon Cloudfront.</li></ul>";
        b.push(a);
        a = document.createElement("div");
        a.className = boxType + " poweredby";
        a.innerHTML = '<h1>Powered by</h1><div class="whiteBlock"><a href="http://reddit.com" target="_blank"><img src="scrolldit/img/byreddit.png"></a><a href="https://github.com/desandro/masonry" target="_blank"><img src="scrolldit/img/byjquery.png"></a><a href="http://imgur.com" target="_blank"><img src="scrolldit/img/byimgur.png"></a><a href="http://pagepeeker.com" target="_blank"><img src="scrolldit/img/bypagepeeker.png"></a><a href="http://aws.amazon.com/cloudfront/" target="_blank"><img src="scrolldit/img/bycf.png"></a><a href="http://developer.yahoo.com/yql/" target="_blank"><img src="scrolldit/img/byyh.png"></a></div>';
        b.push(a);
        var c = "<div class='topbar'><span>Spread the word! <a href='https://www.facebook.com/apps/application.php?id=168213553267018' target='_blank'>Like us!</a></span></div><iframe src='//www.facebook.com/plugins/likebox.php?href=https://www.facebook.com/pages/ScrollDitcom/285055818212877&amp;width=" + newWidth + "&amp;height=258&amp;colorscheme=light&amp;show_faces=true&amp;border_color=%23FFFFFF&amp;stream=false&amp;header=false&amp;appId=168213553267018' scrolling='no' frameborder='0' class='likeBox' width='" + newWidth + "' allowTransparency='true'></iframe>",
            a = document.createElement("div");
        a.className = boxType + " currentUser";
        a.innerHTML = c;
        b.push(a);
        $(b).css({
            opacity: 0
        });
        $(b).imagesLoaded(function() {
            $(b).css({
                opacity: 1
            });
            newWidth > 0 && $(b).each(function(b, a) {
                $(a).css("width", newWidth);
                $(a).find("img").css("width", newWidth)
            });
            $container.append($(b)).masonry("appended", $(b));
            $("#container").masonry("reload");
            $("#zoomer").change(function() {
                $(this).prop("checked") ? $.cookie("zoom", true) : $.cookie("zoom", false)
            });
            $("#autoadder").change(function() {
                $(this).prop("checked") ? $.cookie("autoAdd", true) : $.cookie("autoAdd", false)
            });
            $("#animations").change(function() {
                $(this).prop("checked") ? $.cookie("aniOff", true) : $.cookie("aniOff", false);
                window.location.reload(true)
            })
        })
    }
}
$("#nsfw").change(function() {
    if ($(this).prop("checked")) {
        $.cookie("nsfw", true);
        window.location.href = window.location.href.match(/\?/) ? window.location.href + "&nsfw=1" : window.location.href + "?nsfw=1"
    } else {
        $.cookie("nsfw", false);
        window.location.href = window.location.href.match(/\?/) ? window.location.href + "&nsfw=0" : window.location.href + "?nsfw=0"
    }
});

function zoomTouchCallback() {
    $this = $(this);
    if (!$this.data("zoom")) {
        $this.data("zoom", true);
        $this.parent("a").imageZoom().addClass("zoom")
    }
}

function zoomMouseCallback() {
    $this = $(this);
    if (!$this.data("zoom")) {
        $this.data("zoom", true);
        $this.parent("a").imageZoom().addClass("zoom")
    }
}

function voteTouchCallback() {
    $this = $(element);
    if ($this.find(".external").attr("data-id")) {
        var b = $$this.find(".external").attr("data-id");
        $("#redditVote").length > 0 && b != $("#redditVote").attr("data-id") && $("#redditVote").remove();
        $("#redditVote").length == 0 && ($this.find(".yt").length > 0 ? $this.append('<iframe id="redditVote" class="ytVote" src="http://www.reddit.com/static/button/button2.html?width=40&id=' + b + '&title=&sr=&css=&bgcolor=&bordercolor=&newwindow=1" height="50" width="40" scrolling="no" frameborder="0" style="display: inline;" data-id="' + b + '"></iframe>') : $this.append('<iframe id="redditVote" src="http://www.reddit.com/static/button/button2.html?width=40&id=' + b + '&title=&sr=&css=&bgcolor=&bordercolor=&newwindow=1" height="50" width="40" scrolling="no" frameborder="0" style="display: inline;" data-id="' + b + '"></iframe>'))
    }
}

function voteMouseCallback() {
    showVoteTimer && clearTimeout(showVoteTimer);
    thiz = this;
    showVoteTimer = setTimeout(function() {
        voteMouseCallbackFire(thiz)
    }, 1E3)
}

function voteMouseCallbackFire(b) {
    $this = $(b);
    if ($this.find(".external").attr("data-id")) {
        b = $this.find(".external").attr("data-id");
        $("#redditVote").length > 0 && b != $("#redditVote").attr("data-id") && $("#redditVote").remove();
        $("#redditVote").length == 0 && ($this.find(".yt").length > 0 ? $this.append('<iframe id="redditVote" class="ytVote" src="http://www.reddit.com/static/button/button2.html?width=40&id=' + b + '&title=&sr=&css=&bgcolor=&bordercolor=&newwindow=1" height="50" width="40" scrolling="no" frameborder="0" style="display: inline; "></iframe>') : $this.append('<iframe id="redditVote" src="http://www.reddit.com/static/button/button2.html?width=40&id=' + b + '&title=&sr=&css=&bgcolor=&bordercolor=&newwindow=1" height="50" width="40" scrolling="no" frameborder="0" style="display: inline; "></iframe>'))
    }
}
var showVoteTimer = !1;

function maybeShowLoader() {
    showVoteTimer && clearTimeout(showVoteTimer);
    showVoteTimer = setTimeout(showLoading, 175)
}

function voteMouseLeaveCallback() {
    clearTimeout(showVoteTimer);
    $this = $(this);
    $this.find(".external").attr("data-id") && $("#redditVote").remove()
}
if (/iphone|ipod|ipad/i.test(navigator.userAgent)) {
    if (zoomToggle) $("#container").on("touchstart", ".photo", zoomTouchCallback);
    $("#container").on("touchstart", ".box", voteTouchCallback)
} else {
    if (zoomToggle) $("#container").on("mouseenter", ".photo", zoomMouseCallback);
    $("#container").on("mouseenter", ".box", voteMouseCallback);
    $("#container").on("mouseleave", ".box", voteMouseLeaveCallback)
}

function renderEnd() {
    if (!endReached) {
        var b = [],
            a = document.createElement("div");
        a.className = boxType;
        a.innerHTML = '<h1>You\'ve reached the bottom, <a href="http://www.Scroll.Am" target="_blank">enjoy Scroll.Am!</a><a href="http://www.Scroll.Am" target="_blank"><img src="scrolldit/img/saad.jpg" class="photo" title="Scroll Amazon.com!"></a>';
        b.push(a);
        var c = "<h1>Spread the word! <a href='https://www.facebook.com/apps/application.php?id=168213553267018' target='_blank'>Like us!</a></h1><iframe src='//www.facebook.com/plugins/likebox.php?href=https://www.facebook.com/pages/ScrollDitcom/285055818212877&amp;width=" + newWidth + "&amp;height=258&amp;colorscheme=light&amp;show_faces=true&amp;border_color=%23FFFFFF&amp;stream=false&amp;header=false&amp;appId=168213553267018' scrolling='no' frameborder='0' class='likeBox' width='" + newWidth + "' allowTransparency='true'></iframe>",
            a = document.createElement("div");
        a.className = boxType + " currentUser";
        a.innerHTML = c;
        b.push(a);
        $(b).css({
            opacity: 0
        });
        $(b).imagesLoaded(function() {
            $(b).css({
                opacity: 1
            });
            newWidth > 0 && $(b).each(function(b, a) {
                $(a).css("width", newWidth);
                $(a).find(".").css("width", newWidth)
            });
            $container.append($(b)).masonry("appended", $(b));
            $("#container").masonry("reload")
        })
    }
}

function addRefreshBoxes(b) {
    b != false && refreshBoxes.push(b);
    if (refreshAutoadd) {
        renderBoxes = [];
        $(refreshBoxes).each(function(b, c) {
            renderBoxes.push($(c).get(0))
        });
        $(renderBoxes).insertBefore($(".masonry-brick").eq(positionNew));
        $("#container").masonry("reload");
        renderBoxes = [];
        refreshBoxes = []
    }
    if ($loadingNew.is(":hidden") && refreshBoxes.length > 0) {
        $loadingNew.fadeIn("fast");
        console.log("add")
    } else $loadingNew.is(":visible") && refreshBoxes.length == 0 && $loadingNew.fadeOut("fast");
    if (refreshBoxes.length == 1) {
        $("#checkText").html("Found 1 new post");
        $("#add").fadeIn("fast");
        $("#autoAdd").fadeIn("fast")
    } else if (refreshBoxes.length > 1) {
        $("#checkText").html("Found " + refreshBoxes.length + " new posts");
        $("#add").fadeIn("fast");
        $("#autoAdd").fadeIn("fast")
    } else {
        $loadingNew.fadeOut("fast");
        $("#add").fadeOut("fast");
        $("#autoAdd").fadeOut("fast");
        $("#checkText").html("Checking new posts")
    }
}

function loaderTrack(b, a) {
    if (b == "inc") {
        renderCount = renderCount + a;
        renderCountTotal = renderCountTotal + a
    } else b == "dec" && (renderCount = renderCount - a);
    if (renderCount == 0) {
        $loading.is(":visible") && $loading.fadeOut("fast");
        $loaderNew.is(":visible") && $loaderNew.fadeOut("fast");
        $loadingNew.is(":visible") && refreshBoxes.length == 0 && $loadingNew.fadeOut("fast")
    }
}

function itemLoadedCallback() {
    $this = $(this);
    if ($this.length > 0) {
        $this.css({
            opacity: 1
        });
        if (newWidth > 0) {
            $this.css("width", newWidth);
            $this.find(".photo").css("width", newWidth)
        }
        if ($this.hasClass("refresh")) addRefreshBoxes(this);
        else {
            $container.append($this).masonry("appended", $this);
            $("#container").masonry("reload")
        }
        loaderTrack("dec", 1)
    }
}

function render(b) {
    if (dataAfter && b == false) dataAfterUrl = "&after=" + dataAfter;
    else {
        if (urlParams.t == "press") {
            renderPress();
            endReached = true;
            $loading.fadeOut("fast");
            $loadingNew.fadeOut("fast");
            return true
        }
        if (urlParams.t == "about") {
            renderAbout();
            endReached = true;
            $loading.fadeOut("fast");
            $loadingNew.fadeOut("fast");
            return true
        }
        dataAfterUrl = ""
    }
    if (urlParams.t == "subreddits") {
        redditUrl = "http://www.reddit.com/reddits/";
        var a = "sort=hot&";
        dataAfter && !b && (dataAfterUrl = "&after=" + dataAfter)
    }
    var c;
    if (b) {
        if (ajaxBusy) return;
        $loaderNew.is(":hidden") && $loaderNew.fadeIn("fast");
        $loadingNew.fadeIn("fast");
        c = redditUrl.replace("&sort=new", "");
        ajaxBusyRefresh = true;
        a = redditUrl.match(/\/controversial\/?$/i) || redditUrl.match(/\/top\/?$/i) ? "" : "sort=new&"
    } else {
        $loading.fadeIn("fast");
        ajaxBusy = true;
        c = redditUrl.replace("&sort=new", "");
        a = redditUrl.match(/\/new\/?/i) ? "sort=new&" : "";
        c.match(/\/$/) || (c = c + "/")
    }
    $.jsonp({
        url: c + ".json?" + a + "limit=" + limit + dataAfterUrl,
        callbackParameter: "jsonp",
        timeout: 15E3,
        cache: false,
        error: function(a, c) {
            console.debug(a);
            console.debug(c);
            b || (c == "timeout" ? alert("Connection Timeout. Reddit.com is unreachable. Try again, get some bacon, reload the page.") : urlParams.r ? alert("Connection Error. Are you sure the subreddit exists?") : alert("Connection Error. Try again, reload the page."));
            if (b) {
                $loadingNew.fadeOut("fast");
                ajaxBusyRefresh = false
            } else {
                $loading.fadeOut("fast");
                ajaxBusy = false
            }
        },
        success: function(a) {
            var c = [];
            debug && console.log(a);
            if (b) ajaxBusyRefresh = false;
            else {
                dataAfter = a.data.after;
                ajaxBusy = false
            }
            if (this.url.match("http://www.reddit.com/reddits/.json")) {
                for (i = 0; i <= a.data.children.length - 1; i++)
                    if (urlsRendered.indexOf(a.data.children[i].data.url) == -1 && a.data.children[i].data.url.match(/(qwertyuiopasdfghjklzxcvbnm)/i)) {
                        urlsRendered.push(a.data.children[i].data.url);
                        debug && console.log("Filter: " + a.data.children[i].data.subreddit + " - " + a.data.children[i].data.title + " - " + a.data.children[i].data.id)
                    } else if (urlsRendered.indexOf(a.data.children[i].data.url) == -1) {
                    loaderTrack("inc", 1);
                    urlsRendered.push(a.data.children[i].data.url);
                    var f = "",
                        f = a.data.children[i].data.title.replace('"', "").replace("'", "");
                    debug && console.log(i + ": " + f);
                    f = a.data.children[i].data.over18 == true && nsfwToggle == false ? "" : "<a href='/?r=" + eH(a.data.children[i].data.url) + "' target='_blank' class='external'>" + eH(a.data.children[i].data.url) + "</a><br>" + eH(a.data.children[i].data.title);
                    if (f.length > 0) {
                        var g = document.createElement("div");
                        g.className = boxType;
                        g.innerHTML = f;
                        c.push(g)
                    }
                } else debug && console.log("Duplicate: " + a.data.children[i].data.url);
                if ($(c).length > 0) {
                    $(c).css({
                        opacity: 0
                    });
                    $(c).imagesLoaded(function() {
                        loaderTrack("dec", c.size);
                        b ? $loadingNew.fadeOut("fast") : $loading.fadeOut("fast");
                        $(c).css({
                            opacity: 1
                        });
                        newWidth > 0 && $(c).each(function(a, b) {
                            $(b).css("width", newWidth);
                            $(b).find("img").css("max-width", newWidth)
                        });
                        b ? $(c).each(function(a, b) {
                            addRefreshBoxes(b)
                        }) : $container.append($(c)).masonry("appended", $(c));
                        $container.masonry("reload")
                    })
                } else b ? $loadingNew.fadeOut("fast") : $loading.fadeOut("fast")
            } else {
                if (a.data)
                    for (i = 0; i <= a.data.children.length - 1; i++)
                        if (urlsRendered.indexOf(a.data.children[i].data.url) == -1 && a.data.children[i].data.subreddit.match(/(qwertyuiopasdfghjklzxcvbnm)/i)) {
                            urlsRendered.push(a.data.children[i].data.url);
                            debug && console.log("Filter: " + a.data.children[i].data.subreddit + " - " + a.data.children[i].data.title + " - " + a.data.children[i].data.id)
                        } else if (urlsRendered.indexOf(a.data.children[i].data.url) == -1) {
                    loaderTrack("inc", 1);
                    urlsRendered.push(a.data.children[i].data.url);
                    var f = "",
                        e = eH(a.data.children[i].data.title);
                    debug && console.log(i + ": " + e);
                    if (a.data.children[i].data.over_18 == true && nsfwToggle == false) a.data.children[i].data.url = "http://www.reddit.com/static/nsfw2.png";
                    if (a.data.children[i].data.url.match(/\.(png|jpg|jpeg|gif)$/i)) {
                        debug && console.log("Append Image: found extension - " + a.data.children[i].data.url);
                        f = a.data.children[i].data.url.match(/imgur.com/i) ? "<a href='http://reddit.com" + a.data.children[i].data.permalink + "' target='_blank'>" + e + "</a> <a href='" + eH(a.data.children[i].data.url) + "' target='_blank' class='external' data-id='" + a.data.children[i].data.name + "'>[Imgur]</a><a href='" + eH(a.data.children[i].data.url.replace(regexThumb, "$1")) + "' target='_blank'><img src='" + eH(a.data.children[i].data.url.replace(regexThumb, "$1")) + "' class='photo'></a>" : "<a href='http://reddit.com" + a.data.children[i].data.permalink + "' target='_blank'>" + e + "</a> <a href='" + eH(a.data.children[i].data.url) + "' target='_blank' class='external' data-id='" + a.data.children[i].data.name + "'>[Source]</a> <a href='" + eH(a.data.children[i].data.url) + "' target='_blank'><img src='" + eH(a.data.children[i].data.url) + "' class='photo'></a>"
                    } else if (a.data.children[i].data.url.match(/imgur\.com\/a\//i)) {
                        debug && console.log("Find Image:  - " + a.data.children[i].data.url);
                        $.ajax({
                            url: "http://query.yahooapis.com/v1/public/yql",
                            headers: {
                                id: i,
                                title: e,
                                link: a.data.children[i].data.permalink,
                                redditId: a.data.children[i].data.name,
                                imageLink: eH(a.data.children[i].data.url)
                            },
                            dataType: "jsonp",
                            data: {
                                q: 'select * from json where url="' + eH(a.data.children[i].data.url) + '/all.json"',
                                format: "json"
                            },
                            success: function(a) {
                                id = this.headers.id;
                                e = this.headers.title;
                                if (a && a.query && a.query.results && a.query.results.body && a.query.results.body.p) {
                                    a = $.parseJSON(a.query.results.body.p);
                                    a = "<a href='http://reddit.com" + this.headers.link + "' target='_blank'>" + e + "</a> <a href='" + this.headers.imageLink + "' target='_blank'>[Album]</a><a href='" + this.headers.imageLink + "' target='_blank' class='external' data-id='" + this.headers.redditId + "'><img src='http://imgur.com/" + a.gallery[0].hash + "l" + a.gallery[0].ext + "' class='photo'></a>"
                                } else a = "<a href='http://reddit.com" + this.headers.link + "' target='_blank'>" + e + "</a> <a href='" + this.headers.imageLink + "' target='_blank'>[Album]</a>";
                                var c = document.createElement("div");
                                c.className = b ? boxType + " refresh" : boxType;
                                c.innerHTML = a;
                                $(c).attr("data-rank", id + rank).css({
                                    opacity: 0
                                }).imagesLoaded(itemLoadedCallback)
                            },
                            error: function() {
                                e = this.headers.title;
                                id = this.headers.id;
                                var a = "<a href='http://reddit.com" + this.headers.link + "' target='_blank'>" + e + "</a> <a href='" + this.headers.imageLink + "' target='_blank' class='external' data-id='" + this.headers.redditId + "'>[Album]</a>",
                                    c = document.createElement("div");
                                c.className = b ? boxType + " refresh" : boxType;
                                c.innerHTML = a;
                                $(c).attr("data-rank", id + rank).css({
                                    opacity: 0
                                }).imagesLoaded(itemLoadedCallback)
                            }
                        })
                    } else if (a.data.children[i].data.url.match(/flickr\.com/i)) {
                        g = a.data.children[i].data.url.match(regexFlickr);
                        debug && console.log("Append Image: found flickr - " + eH(a.data.children[i].data.url) + " - Flickr ID: " + g[1]);
                        g ? $.ajax({
                            url: "http://query.yahooapis.com/v1/public/yql",
                            headers: {
                                id: i,
                                title: e,
                                link: a.data.children[i].data.permalink,
                                redditId: a.data.children[i].data.name,
                                imageLink: eH(a.data.children[i].data.url)
                            },
                            dataType: "jsonp",
                            data: {
                                q: "select * from flickr.photos.sizes where photo_id = " + g[1] + " and api_key = 3ddea013155fc95d4685c20f1e4ba063",
                                format: "json"
                            },
                            success: function(c) {
                                id = this.headers.id;
                                e = this.headers.title;
                                redditId = this.headers.redditId;
                                debug && console.log("Append Image: found flickr medium size - " + a.data.children[id].data.url + " = " + h);
                                if (c && c.query && c.query.results && c.query.results.size[3] && c.query.results.size[3].source) var h = c.query.results.size[3].source,
                                    h = (c = c.query.results.size.last().source) ? "<a href='http://reddit.com" + this.headers.link + "' target='_blank'>" + e + "</a> <a href='" + this.headers.imageLink + "' target='_blank' class='external' data-id='" + redditId + "'>[Flickr]</a><a href='" + c + "' target='_blank'><img src='" + h + "' class='photo'></a>" : "<a href='http://reddit.com" + this.headers.link + "' target='_blank'>" + e + "</a> <a href='" + this.headers.imageLink + "' target='_blank' class='external' data-id='" + redditId + "'>[Flickr]</a><a href='" + h + "' target='_blank'><img src='" + h + "' class='photo'></a>";
                                else h = "<a href='http://reddit.com" + this.headers.imageLink + "' target='_blank'>" + e + "</a> <a href='http://reddit.com" + this.headers.link + "' target='_blank' class='external' data-id='" + redditId + "'>[Comments]</a>";
                                c = document.createElement("div");
                                c.className = b ? boxType + " refresh" : boxType;
                                c.innerHTML = h;
                                $(c).attr("data-rank", id + rank).css({
                                    opacity: 0
                                }).imagesLoaded(itemLoadedCallback)
                            },
                            error: function() {
                                e = this.headers.title;
                                id = this.headers.id;
                                var a = "<a href='http://reddit.com" + this.headers.link + "' target='_blank'>" + e + "</a> <a href='" + this.headers.imageLink + "' target='_blank' class='external' data-id='" + this.headers.redditId + "'>[Photo]</a>",
                                    c = document.createElement("div");
                                c.className = b ? boxType + " refresh" : boxType;
                                c.innerHTML = a;
                                $(c).attr("data-rank", id + rank).css({
                                    opacity: 0
                                }).imagesLoaded(itemLoadedCallback)
                            }
                        }) : f = "<a href='" + eH(a.data.children[i].data.url) + "' target='_blank'>" + e + "</a>"
                    } else if (a.data.children[i].data.url.match(/imgur\.com/i)) {
                        debug && console.log("Append Image: found no extension - " + a.data.children[i].data.url);
                        f = "<a href='http://reddit.com" + a.data.children[i].data.permalink + "' target='_blank'>" + e + "</a> <a href='" + eH(a.data.children[i].data.url) + "' target='_blank' class='external' data-id='" + a.data.children[i].data.name + "'>[Imgur]</a><a href='" + eH(a.data.children[i].data.url.replace(/\/gallery/, "")) + ".jpg' target='_blank'><img src='" + eH(a.data.children[i].data.url.replace(/\/gallery/, "")) + ".jpg' class='photo'></a>"
                    } else if (a.data.children[i].data.url.match(/soundcloud\.com/i)) {
                        debug && console.log("Append Audio: found soundcloud - " + a.data.children[i].data.url);
                        $.ajax({
                            url: "http://query.yahooapis.com/v1/public/yql",
                            headers: {
                                id: i,
                                title: e,
                                link: a.data.children[i].data.permalink,
                                redditId: a.data.children[i].data.name,
                                url: eH(a.data.children[i].data.url)
                            },
                            dataType: "jsonp",
                            data: {
                                q: 'select * from json where url= "http://soundcloud.com/widget.json?url=' + eH(a.data.children[i].data.url) + '"',
                                format: "json"
                            },
                            success: function(a) {
                                debug && console.log(a);
                                id = this.headers.id;
                                if (a && a.query && a.query.results && a.query.results.json && a.query.results.json.id)
                                    if (a.query.results.json.tracks) var c = "",
                                        c = a.query.results.json.tracks.length ? a.query.results.json.tracks[0].stream_url + "?url=" + a.query.results.json.tracks[0].uri : a.query.results.json.tracks.stream_url + "?url=" + a.query.results.json.tracks.uri,
                                        a = "<a href='http://reddit.com" + this.headers.link + "' target='_blank'>" + this.headers.title + "</a><a onclick='renderSoundcloud($(this).parent())' class='external' data-id='" + this.headers.redditId + "' data-scid='" + a.query.results.json.id + "' data-pl='1' data-su='" + c + "' data-sl='" + this.headers.url + "'><img src='img/sc.jpg' width='297' height='79' class='photo'/></a>";
                                    else a = "<a href='http://reddit.com" + this.headers.link + "' target='_blank'>" + this.headers.title + "</a><a onclick='renderSoundcloud($(this).parent())' class='external' data-id='" + this.headers.redditId + "' data-scid='" + a.query.results.json.id + "' data-pl='0' data-su='" + a.query.results.json.stream_url + "?url=" + a.query.results.json.uri + "' data-sl='" + this.headers.url + "'><img src='img/sc.jpg' width='297' height='79' class='photo'/></a>";
                                else a = "<a href='http://reddit.com" + this.headers.link + "' target='_blank'>" + this.headers.title + "</a><a href='" + this.headers.url + "' target='_blank' class='external' data-id='" + this.headers.redditId + "'><img src='img/sc.jpg' width='297' height='79' class='photo'/></a>";
                                c = document.createElement("div");
                                c.className = b ? boxType + " refresh" : boxType;
                                c.innerHTML = a;
                                $(c).attr("data-rank", id + rank).css({
                                    opacity: 0
                                }).imagesLoaded(itemLoadedCallback)
                            },
                            error: function() {
                                e = this.headers.title;
                                id = this.headers.id;
                                var a = "<a href='http://reddit.com" + this.headers.link + "' target='_blank'>" + this.headers.title + "</a><a href='" + this.headers.url + "' class='external' target='_blank' data-id='" + this.headers.redditId + "'><img src='img/sc.jpg' width='297' height='79' class='photo'/></a>",
                                    c = document.createElement("div");
                                c.className = b ? boxType + " refresh" : boxType;
                                c.innerHTML = a;
                                $(c).attr("data-rank", id + rank).css({
                                    opacity: 0
                                }).imagesLoaded(itemLoadedCallback)
                            }
                        })
                    } else if (a.data.children[i].data.url.match(/qkme\.me/i)) {
                        debug && console.log("Append Image: found qkme.me - " + a.data.children[i].data.url);
                        f = "<a href='http://reddit.com" + a.data.children[i].data.permalink + "' target='_blank'>" + e + "</a> <a href='" + eH(a.data.children[i].data.url) + "' target='_blank' class='external' data-id='" + a.data.children[i].data.name + "'>[Qkme.me]</a><a href='http://i.qkme.me/" + eH(a.data.children[i].data.url.match(/\.me\/([A-za-z0-9]+)/)[1]) + ".jpg' target='_blank'><img src='http://i.qkme.me/" + eH(a.data.children[i].data.url.match(/\.me\/([A-za-z0-9]+)/)[1]) + ".jpg' class='photo'></a>"
                    } else if (a.data.children[i].data.url.match(/quickmeme\.com/i)) {
                        debug && console.log("Append Image: found quickmeme.com - " + a.data.children[i].data.url);
                        f = "<a href='http://reddit.com" + a.data.children[i].data.permalink + "' target='_blank'>" + e + "</a> <a href='" + eH(a.data.children[i].data.url) + "' target='_blank' class='external' data-id='" + a.data.children[i].data.name + "'>[Qkme.me]</a><a href='http://i.qkme.me/" + eH(a.data.children[i].data.url.match(/meme\/([A-za-z0-9]+)/)[1]) + ".jpg' target='_blank'><img src='http://i.qkme.me/" + eH(a.data.children[i].data.url.match(/meme\/([A-za-z0-9]+)/)[1]) + ".jpg' class='photo'></a>"
                    } else if (a.data.children[i].data.url.match(regexYoutube)) {
                        f = eH(a.data.children[i].data.url.match(regexYoutube)[1]);
                        debug && console.log("Append Youtube:" + a.data.children[i].data.permalink);
                        f = "<a href='http://reddit.com" + a.data.children[i].data.permalink + "' target='_blank'>" + e + "</a><a onclick='renderYoutube($(this).parent())' class='external' data-id='" + a.data.children[i].data.name + "' data-yt='" + f + "'><img src='http://img.youtube.com/vi/" + f + "/hqdefault.jpg' class='photo'><img src='img/play.png' class='playButton'></a>"
                    } else if (a.data.children[i].data.url.match(regexVimeo) !== null) $.ajax({
                        url: "http://www.vimeo.com/api/v2/video/" + a.data.children[i].data.url.match(regexVimeo)[3] + ".json",
                        headers: {
                            id: i,
                            title: e,
                            link: a.data.children[i].data.permalink,
                            redditId: a.data.children[i].data.name,
                            url: eH(a.data.children[i].data.url)
                        },
                        dataType: "jsonp",
                        data: {
                            format: "json"
                        },
                        success: function(a) {
                            debug && console.log(a);
                            id = this.headers.id;
                            var a = a.length > 0 ? a[0].thumbnail_large ? "<a href='http://reddit.com" + this.headers.link + "' target='_blank'>" + this.headers.title + "</a><a onclick='renderVimeo($(this).parent())' class='external' data-id='" + this.headers.redditId + "' data-vm='" + a[0].id + "'><img src='" + a[0].thumbnail_large + "' class='photo'/><img src='img/play.png' class='playButton'></a>" : "<a href='" + this.headers.url + "' target='_blank' class='external' data-id='" + this.headers.redditId + "'>" + this.headers.title + "</a> <a href='http://reddit.com" + this.headers.link + "' target='_blank'>[Comments]</a>" : "<a href='" + this.headers.url + "' target='_blank' class='external' data-id='" + this.headers.redditId + "'>" + this.headers.title + "</a> <a href='http://reddit.com" + this.headers.link + "' target='_blank'>[Comments]</a>",
                                c = document.createElement("div");
                            c.className = b ? boxType + " refresh" : boxType;
                            c.innerHTML = a;
                            $(c).attr("data-rank", this.headers.id + rank).css({
                                opacity: 0
                            }).imagesLoaded(itemLoadedCallback)
                        },
                        error: function() {
                            e = this.headers.title;
                            var a = "<a href='" + this.headers.url + "' target='_blank' class='external' data-id='" + this.headers.redditId + "'>" + this.headers.title + "</a> <a href='http://reddit.com" + this.headers.link + "' target='_blank'>[Comments]</a>",
                                c = document.createElement("div");
                            c.className = b ? boxType + " refresh" : boxType;
                            c.innerHTML = a;
                            $(c).attr("data-rank", this.headers.id + rank).css({
                                opacity: 0
                            }).imagesLoaded(itemLoadedCallback)
                        }
                    });
                    else {
                        debug && console.log("No render for url:" + a.data.children[i].data.permalink);
                        if (a.data.children[i].data.url.match(/reddit\.com/)) {
                            f = a.data.children[i].data.selftext ? '<p class="selftext" title="' + eH(a.data.children[i].data.selftext) + '">' + eH(a.data.children[i].data.selftext) + "" : "";
                            f = "<a href='" + eH(a.data.children[i].data.url) + "' target='_blank' class='external' data-id='" + a.data.children[i].data.name + "'>" + e + "</a>" + f
                        } else {
                            g = a.data.children[i].data.url.replace(/\?utm_source.*$/, "").replace("#", "%23");
                            $.pagekeeper({
                                url: "http://pagepeeker.com/thumbs_generated.php?size=x&url=" + g,
                                urlExternal: eH(a.data.children[i].data.url),
                                link: a.data.children[i].data.permalink,
                                title: e,
                                id: i,
                                redditId: a.data.children[i].data.name,
                                callback: "__pp_rd",
                                timeout: 5E3,
                                success: function(a, c) {
                                    data = this.url.match(/url=(.*)&title=(.*)&link=(.*)&redditId=(.*)/);
                                    if (this.urlExternal.replace(/\?utm_source.*$/, "").replace("#", "%23").indexOf(c) != -1 && a == 1) {
                                        debug && console.log(c + ":" + this.urlExternal + ":" + a);
                                        var e = "<a href='" + this.urlExternal + "' target='_blank' class='external' data-id='" + this.redditId + "'>" + this.title + "</a> <a href='http://reddit.com" + this.link + "' target='_blank'>[Comments]</a><a href='" + this.urlExternal + "' target='_blank'><img src='http://pagepeeker.com/thumbs.php?size=x&url=" + this.urlExternal + "' class='photo screenshot'></a>"
                                    } else {
                                        debug && console.log(c + ":" + this.urlExternal + ":" + a);
                                        e = "<a href='" + this.urlExternal + "' target='_blank' class='external' data-id='" + this.redditId + "'>" + this.title + "</a> <a href='http://reddit.com" + this.link + "' target='_blank'>[Comments]</a>"
                                    }
                                    var d = document.createElement("div");
                                    d.className = b ? boxType + " refresh" : boxType;
                                    d.innerHTML = e;
                                    $(d).attr("data-rank", this.id + rank).css({
                                        opacity: 0
                                    }).imagesLoaded(itemLoadedCallback)
                                },
                                error: function() {
                                    var a = "<a href='" + this.urlExternal + "' target='_blank' class='external' data-id='" + this.redditId + "'>" + this.title + "</a> <a href='http://reddit.com" + this.link + "' target='_blank'>[Comments]</a>",
                                        c = document.createElement("div");
                                    c.className = b ? boxType + " refresh" : boxType;
                                    c.innerHTML = a;
                                    $(c).attr("data-rank", this.id + rank).css({
                                        opacity: 0
                                    }).imagesLoaded(itemLoadedCallback)
                                }
                            })
                        }
                    }
                    if (f.length > 0) {
                        g = document.createElement("div");
                        g.className = b ? boxType + " refresh" : boxType;
                        g.innerHTML = f;
                        $(g).attr("data-rank", i + rank);
                        c.push(g)
                    }
                } else debug && console.log("Duplicate: " + a.data.children[i].data.url);
                if ($(c).length > 0) {
                    $(c).css({
                        opacity: 0
                    });
                    var j = [],
                        k = 0;
                    $(c).each(function(a, e) {
                        j.push(e);
                        k = k + 1;
                        if (j.length == limitRender || c.length - k == 0) {
                            var d = j;
                            $(d).imagesLoaded(function() {
                                $(d).css({
                                    opacity: 1
                                });
                                newWidth > 0 && $(d).each(function(a, b) {
                                    $(b).css("width", newWidth);
                                    $(b).find(".photo").css("width", newWidth)
                                });
                                b ? $(d).each(function(a, b) {
                                    addRefreshBoxes(b)
                                }) : $container.append($(d)).masonry("appended", $(d));
                                loaderTrack("dec", d.length);
                                if (renderCount == 0 && firstRender && !tenSecondsPassed) {
                                    firstRender = false;
                                    $(".yt").length > 0 && $(".yt").each(function(a, b) {
                                        $(b).attr("src", $(b).attr("src").replace("autoplay=1&", ""))
                                    });
                                    $(".vm").length > 0 && $(".vm").each(function(a, b) {
                                        $(b).attr("src", $(b).attr("src").replace("&autoplay=1", ""))
                                    });
                                    $(".sc").length > 0 && $(".sc").each(function(a, b) {
                                        $(b).attr("src", $(b).attr("src").replace("&auto_play=true", ""))
                                    });
                                    $container.html($("." + boxType).sort(sortDescending));
                                    $("#container").masonry("reload");
                                    $("#browseDropdown").change(function() {
                                        if ($(this).val() != "disabled") window.location.href = $(this).val() == "subreddits" ? "http://" + window.location.host + "/?t=subreddits" : "http://" + window.location.host + "/?r=" + $(this).val()
                                    });
                                    $("#r").val(urlParams.r);
                                    $("#logobox").hover(function() {
                                        $("#logo-hover").stop(true, true);
                                        $("#logo-hover").fadeIn("fast")
                                    }, function() {
                                        $("#logo-hover").fadeOut("fast")
                                    });
                                    $("#nsfw").change(function() {
                                        if ($(this).prop("checked")) {
                                            $.cookie("nsfw", true);
                                            window.location.href = window.location.href.match(/\?/) ? window.location.href + "&nsfw=1" : window.location.href + "?nsfw=1"
                                        } else {
                                            $.cookie("nsfw", false);
                                            window.location.href = window.location.href.match(/\?/) ? window.location.href + "&nsfw=0" : window.location.href + "?nsfw=0"
                                        }
                                    })
                                } else $("#container").masonry("reload");
                                $(window).height() > $container.height() && (renderCount == 0 && !b) && render(false)
                            });
                            j = []
                        }
                    });
                    b || (rank = rank + limit)
                }
                loaderTrack("dec", 0);
                !b && $(c).length > 0 && addAd()
            }
        }
    })
}

function addAd() {
    if (renderCountTotal / 50 > adsTotal) {
        adsTotal = adsTotal + 1;
        if (adsTotal == 1 || adsTotal == 3 || adsTotal == 5) {
            var b = document.createElement("div");
            b.className = boxType + " reddit";
            b.innerHTML = "<h1><a href='http://www.Scroll.Am' target='_blank'>Scroll Amazon: Scroll.Am!</a></h1><a href='http://www.Scroll.Am' target='_blank'><img src='img/saad.jpg' class='photo' title='Scroll Amazon!'></a>";
            $(b).attr("data-rank", rank + 1).css({
                opacity: 0
            }).imagesLoaded(function() {
                $(b).css({
                    opacity: 1
                });
                if (newWidth > 0) {
                    $(b).css("width", newWidth);
                    $(b).find("img").css("width", newWidth);
                    $(b).find("iframe").css("width", newWidth)
                }
                $container.append($(b)).masonry("appended", $(b));
                $("#container").masonry("reload")
            })
        } else $.ajax({
            url: "http://query.yahooapis.com/v1/public/yql",
            dataType: "jsonp",
            data: {
                q: 'select * from html where url="http://www.redditmedia.com/ads/" and xpath="//div[@id=\'ad\']"',
                format: "json"
            },
            success: function(a) {
                if (a && a.query && a.query.results && a.query.results.div && a.query.results.div.a && a.query.results.div.a.href && a.query.results.div.a.img && a.query.results.div.a.img.src) {
                    var b = a.query.results.div.a.href,
                        a = a.query.results.div.a.img.src;
                    debug && console.log("Append Ad: " + b + " - " + a);
                    b = "<h1><a href='http://store.reddit.com/index.html' target='_blank'>Support Reddit - Advertisement</a></h1><a href='" + eH(b) + "' target='_blank'><img src='" + eH(a) + "' class='photo'></a>";
                    adsTotal == 2 && (b = "<h1>Spread the word! <a href='https://www.facebook.com/apps/application.php?id=168213553267018' target='_blank'>Like us!</a></h1><iframe src='//www.facebook.com/plugins/likebox.php?href=https://www.facebook.com/pages/ScrollDitcom/285055818212877&amp;width=" + newWidth + "&amp;height=258&amp;colorscheme=light&amp;show_faces=true&amp;border_color=%23FFFFFF&amp;stream=false&amp;header=false&amp;appId=168213553267018' scrolling='no' frameborder='0' class='likeBox' width='" + newWidth + "' allowTransparency='true'></iframe>");
                    var d = document.createElement("div");
                    d.className = boxType + " reddit";
                    d.innerHTML = b;
                    $(d).attr("data-rank", rank + 1).css({
                        opacity: 0
                    }).imagesLoaded(function() {
                        $(d).css({
                            opacity: 1
                        });
                        if (newWidth > 0) {
                            $(d).css("width", newWidth);
                            $(d).find("img").css("width", newWidth);
                            $(d).find("iframe").css("width", newWidth)
                        }
                        $container.append($(d)).masonry("appended", $(d));
                        $("#container").masonry("reload")
                    })
                }
            }
        })
    }
}
showLoading();
render(!1);
"subreddits" != urlParams.t && ("about" != urlParams.t && "press" != urlParams.t) && setTimeout("refresher = setInterval(updateNew, intervalUpdates)", 15E3);

function updateNew() {
    render(true)
}

function stopRefresh() {
    clearInterval(refresher)
}
$("#stop").click(function() {
    clearInterval(refresher);
    $.cookie("autoAdd", false);
    refreshAutoadd = false;
    $loadingNew.fadeOut("fast")
});
$("#autoAdd").click(function() {
    $.cookie("autoAdd", true);
    refreshAutoadd = true;
    renderBoxes = [];
    $(refreshBoxes).each(function(b, a) {
        renderBoxes.push($(a).get(0))
    });
    $(renderBoxes).insertBefore($(".masonry-brick").eq(positionNew));
    $("#container").masonry("reload");
    renderBoxes = [];
    refreshBoxes = [];
    addRefreshBoxes(false)
});
$("#add").click(function() {
    renderBoxes = [];
    $(refreshBoxes).each(function(b, a) {
        renderBoxes.push($(a).get(0))
    });
    $(renderBoxes).insertBefore($(".masonry-brick").eq(positionNew));
    $("#container").masonry("reload");
    renderBoxes = [];
    refreshBoxes = [];
    addRefreshBoxes(false)
});
$(window).scroll(function() {
    $(window).scrollTop() >= $(document).height() - $(window).height() - $(window).height() / 1.5 && (ajaxBusy || render(false))
});
Modernizr.touch && $(document).bind("mouseup touchend", mobileInfscr);

function mobileInfscr() {
    setTimeout(function() {
        var b = $(document).height(),
            a = $(window).scrollTop();
        b - a < 500 && (ajaxBusy || render(false))
    }, 400)
}

function showLoading() {
    var b = $(window).height(),
        a = $(window).scrollTop();
    $loading.css({
        top: b - 150 + a + "px"
    });
    $loadingNew.css({
        top: a - 5 + "px"
    })
}
var showTimer = !1;

function maybeShowLoader() {
    showTimer && clearTimeout(showTimer);
    showTimer = setTimeout(showLoading, 175)
}
$(window).bind("scroll", maybeShowLoader);

function renderYoutube(b) {
    debug && console.log(b);
    var b = $(b).find(".external"),
        a = "<iframe class='yt external' type='text/html' width='" + newWidth + "' height='" + newWidth / 1.44 + "' src='http://www.youtube.com/embed/" + $(b).attr("data-yt") + "?autohide=1&modestbranding=1&showinfo=0&autoplay=1&showsearch=0&version=3&enablejsapi=1&wmode=Opaque&origin=" + window.location.host + "' frameborder='0' data-id='" + $(b).attr("data-id") + "' webkitAllowFullScreen allowFullScreen></iframe>";
    $(b).replaceWith(a);
    $("#container").masonry("reload")
}

function renderVimeo(b) {
    debug && console.log(b);
    var b = $(b).find(".external"),
        a = "<iframe class='vm external' src='http://player.vimeo.com/video/" + $(b).attr("data-vm") + "?title=0&amp;byline=0&amp;portrait=0&amp;autoplay=1' width='" + newWidth + "' height='" + newWidth / 1.44 + "' frameborder='0' data-id='" + $(b).attr("data-id") + "' webkitAllowFullScreen allowFullScreen></iframe>";
    $(b).replaceWith(a);
    $("#container").masonry("reload")
}

function renderSoundcloud(b) {
    var b = $(b).find(".external"),
        a = $(b).attr("data-pl") == "1" ? "<object height='81' width='100%'> <param name='movie' value='http://player.soundcloud.com/player.swf?url=http%3A%2F%2Fapi.soundcloud.com%2Fplaylists%2F" + $(b).attr("data-scid") + "&show_comments=false&auto_play=true&color=000000'></param> <param name='allowscriptaccess' value='always'></param> <embed allowscriptaccess='always' height='81' class='sc' src='http://player.soundcloud.com/player.swf?url=http%3A%2F%2Fapi.soundcloud.com%2Fplaylists%2F" + $(b).attr("data-scid") + "&show_comments=false&auto_play=true&color=000000' type='application/x-shockwave-flash' width='100%'></embed><audio style='width:100%; height:15px' src='" + $(b).attr("data-su") + "' controls preload='none'></audio><a href='" + $(b).attr("data-sl") + "' target='_blank'>[Soundcloud Player]</a></object>" : "<object height='81' width='100%'> <param name='movie' value='http://player.soundcloud.com/player.swf?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F" + $(b).attr("data-scid") + "&show_comments=false&auto_play=true&color=000000'></param> <param name='allowscriptaccess' value='always'></param> <embed allowscriptaccess='always' height='81' class='sc'  src='http://player.soundcloud.com/player.swf?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F" + $(b).attr("data-scid") + "&show_comments=false&auto_play=true&color=000000' type='application/x-shockwave-flash' width='100%'></embed><audio style='width:100%; height:15px' src='" + $(b).attr("data-su") + "' controls preload='none'></audio><a href='" + $(b).attr("data-sl") + "' target='_blank'>[Soundcloud Player]</a></object>";
    $(b).replaceWith(a);
    $("#container").masonry("reload")
}

function boxWidth(b) {
    viewWidth = $container.width();
    b == 0 && (viewWidth = viewWidth - 17);
    if (viewWidth < 460) {
        b > 0 || (b = 1);
        boxSize = (viewWidth - b * 16) / b
    }
    viewWidth < 801 ? b > 0 || (b = 2) : viewWidth < 1025 ? b > 0 || (b = 4) : b > 0 || (b = Math.floor(viewWidth / 330));
    boxSize = (viewWidth - b * 16) / b;
    boxSize > 170 ? columns = b : boxSize = 170;
    return Math.floor(boxSize)
}

function zoomBox(b) {
    if (columns > 1 || columns == 1 && b == 1) {
        b == -1 ? newWidth = boxWidth(columns - 1) : b == 1 && (newWidth = boxWidth(columns + 1));
        $(".box").css("width", newWidth);
        $(".boxFast").css("width", newWidth);
        $(".photo").css("width", newWidth);
        $(".likeBox").css("width", newWidth);
        $(".likeBox").attr("width", newWidth);
        $(".whiteBlock img").css("width", newWidth);
        $(".boxFast iframe").attr("width", newWidth);
        $(".box iframe").attr("width", newWidth);
        $(".boxFast iframe").attr("height", newWidth / 1.44);
        $(".box iframe").attr("height", newWidth / 1.44);
        $(".likeBox").attr("src", "//www.facebook.com/plugins/likebox.php?href=https://www.facebook.com/pages/ScrollDitcom/285055818212877&amp;width=" + newWidth + "&amp;height=" + newWidth / 1.44 + "&amp;colorscheme=light&amp;show_faces=true&amp;border_color=%23FFFFFF&amp;stream=false&amp;header=false&amp;appId=168213553267018");
        $(".box object").attr("width", newWidth);
        $(".boxFast object").attr("width", newWidth);
        $(".box object").attr("height", newWidth / 1.44);
        $(".boxFast object").attr("height", newWidth / 1.44);
        $(".gallery").masonry("reload");
        $("#container").masonry("reload");
        $(window).height() > $container.height() && render(false)
    }
}
$(document).keyup(function(b) {
    b.keyCode == 107 && !$("#r").is(":focus") && zoomBox(-1);
    b.keyCode == 109 && !$("#r").is(":focus") && zoomBox(1)
});