(function(window, document) {


window.bold = function() {
    document.execCommand( "bold", false, null );
};

window.italic = function() {
    document.execCommand( "italic", false, null );
};

window.underline = function() {
    document.execCommand( "underline", false, null );
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

}(this, this.document));
