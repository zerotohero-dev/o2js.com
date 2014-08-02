(function(window, document) {


window.bold = function() {
//    document.execCommand( "bold", false, null );
};

window.italic = function() {
//    document.execCommand( "italic", false, null );
};

window.underline = function() {
//    document.execCommand( "underline", false, null );
};

function insertNodeAtCaret(node) {
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var range = sel.getRangeAt(0);
            range.collapse(false);
            range.insertNode(node);
            range = range.cloneRange();
            range.selectNodeContents(node);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    } else if (typeof document.selection != "undefined" && document.selection.type != "Control") {
        var html = (node.nodeType == 1) ? node.outerHTML : node.data;
        var id = "marker_" + ("" + Math.random()).slice(2);
        html += '<span id="' + id + '"></span>';
        var textRange = document.selection.createRange();
        textRange.collapse(false);
        textRange.pasteHTML(html);
        var markerSpan = document.getElementById(id);
        textRange.moveToElementText(markerSpan);
        textRange.select();
        markerSpan.parentNode.removeChild(markerSpan);
    }
}

window.img = function() {
    var img  = document.createElement('img');
    img.src = 'https://bitbucket-assetroot.s3.amazonaws.com/c/photos/2014/Apr/20/ionic.twitter.sample-logo-4203547186-0_avatar.png';
    img.width = 30;
    img.height = 30;


    var link = document.createElement('a');

    link.appendChild(img);

    link.href = 'javascript:void(0);';

    var node = document.createTextNode('hello world');

    link.appendChild(node);

    insertNodeAtCaret(link);
};

function g(id) {return document.getElementById(id);}

g('ActualInput').focus();

var inp = g('ActualInput'),
    mir = g('MirrorInput');

inp.onkeyup = function(evt) {
    var shouldCompose = evt.keyCode === 13;

    console.log(evt.keyCode);

    if (evt.keyCode === 8 && inp.value.length === 0) {
        mir.innerHTML = '';

        var prev = mir.previousSibling;

        if (prev) {
            console.log(prev);
            if (prev.nodeType === 3) {
                while(prev && !prev.nodeValue) {
                    console.log('in while');

                    if (prev.nodeType !== 3) {
                        prev.appendChild(mir);
                        prev.appendChild(inp);
                        inp.focus();

                        console.log('breaking bad');

                        return;
                    }

                    prev2 = prev.previousSibling;

                    prev.parentNode.removeChild(prev);

                    prev = prev2;
                }

                console.log('nodeval: "' + prev.nodeValue + '"');

                if ( prev.nodeValue.lastIndexOf(' ') === -1) {
                    var left = "";
                    var right = prev.nodeValue;

                    console.log("'" + left + "'");

                    prev.parentNode.removeChild(prev);

                    if (!right) {
                        console.log('not right');

                    } else {
                        mir.innerHTML = right;
                        inp.value = right;
                    }



                    return;
                }

                var left = prev.nodeValue.slice(0, prev.nodeValue.lastIndexOf(' '));
                var right = prev.nodeValue.slice(prev.nodeValue.lastIndexOf(' '));

                console.log("'" + left + "'");

                prev.nodeValue = left;

                if (!right) {
                    console.log('not right');

                } else {
                    mir.innerHTML = right;
                    inp.value = right;
                }


                console.log("'" + right + "'");
            } else {
                console.log('I AM IN ELSE BABY!');

                        prev.appendChild(mir);
                        prev.appendChild(inp);

                        inp.focus();

                        console.log('breaking bad 2');

                        return;


            }
        }

        return;
    }

    if (/^\s*$/.test(inp.value)) {return;}

    mir.innerHTML = inp.value;

    if (shouldCompose) {
        console.log('nextSibling:');
        console.log(inp.nextSibling);

        if (!inp.nextSibling) {
            console.log("AAAA:" + inp.parentNode.nodeName);

            if (inp.parentNode.nodeName === 'A') {
                var grandParent = inp.parentNode.parentNode;
                if (inp.parentNode.nextSibling) {
                    console.log("case 001");
                    grandParent.insertBefore(inp, inp.parentNode.nextSibling);
                    grandParent.insertBefore(mir, inp.parentNode.nextSibling);
                } else {
                    console.log('case 002');
                    //grandParent.appendChild(mir);
                    grandParent.appendChild(inp);
                }
            }

        }


        while (mir.hasChildNodes()) {
            mir.parentNode.insertBefore(mir.lastChild, mir);
        }

        inp.value = '';

        inp.parentNode.insertBefore(mir, inp);

        inp.focus();
    }
};

setInterval(function() {
    var mir = document.getElementById('MirrorInput');

    window.counter = window.counter || 0;

    if (window.counter % 2) {
        mir.style.borderRightColor = "#ffffff"
    } else {
        mir.style.borderRightColor = '#0000ff';
    }

    window.counter++;

}, 1000);

}(this, this.document));
