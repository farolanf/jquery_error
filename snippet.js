function updateEditors(height) {
    var i = 0;
    $('textarea[data-editor]').each(function() {
        var textarea = $(this);
        var mode = textarea.data('editor');
        var editDiv = $('<div>', {
            position: 'relative',
            width: textarea.width(),
            height: textarea.height(),
            'class': textarea.attr('class') // modify these to include the Row div
        }).insertBefore(textarea);
        editDiv.attr('data-val', '' + val + '');
        textarea.hide();
        var editor = ace.edit(editDiv[i]);
        alert('ace.edit' + (i))
        editor.focus();
        editor.setTheme("ace/theme/dawn");
        editor.renderer.setShowGutter(false);
        editor.setHighlightActiveLine(false);
        editor.setOption("showPrintMargin", false);
        editor.setOption("wrap", true);
        editor.setOption("tabSize", 0);
        editor.setOption("useSoftTabs", true);
        editor.resize();
        textarea.closest('form').submit(function() {
            textarea.val(editor.getSession().getValue());
        });
        i++;
    });
}

function addNewEditor() {
    // handle add speakers
    addSpeakerLabels(function(done, height) {
        $("body").append(done);
        updateEditors(height);
    });
    val++;
}

function addSpeaker(val) {
    var size = speakers.size;
    speakers.push("Speaker " + size);
}

function addSpeakerLabels(done) {
    var heightOfEditor = 0;
    var beginning;
    if (val > 1) {
        heightOfEditor = $(".row[data-val=" + val + "]").height();
        heightOfEditor = heightOfEditor + 20;
    }
    if (heightOfEditor == 0) {
        beginning = '<div class="row" data-val="' + val + '"><div class="speaker col-md-1">' +
            '<div class="dropdown" data-val="' + val + '"><button class="btn btn-primary dropdown-toggle"' +
            'type="button" data-toggle="dropdown">Speaker 1<span class="caret"></span></button>';
    } else {
        beginning = '<div class="row" data-val="' +
            val + '"><div class="speaker col-md-1"><div class="dropdown">' +
            '<button class="btn btn-primary dropdown-toggle" type="button"' +
            ' data-toggle="dropdown">Speaker 1<span class="caret"></span></button>';
    }
    var htmlToAdd = '<ul class="dropdown-menu" data-val="' + val + '"' +
        'aria-labelledby="menu1"><li role="presentation">' +
        '<a role="menuitem" tabindex="-1" class="addNew" data-val="' + val + '" href="#">Add New Speaker</a></li>';
    speakers.forEach(function(speaker) {
        htmlToAdd = htmlToAdd + '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" data-value="' + speaker + '">' + speaker + '</a></li>';
    });
    htmlToAdd = htmlToAdd + "</ul>";
    done(beginning + htmlToAdd + '</div></div><textarea data-val=' +
        val + ' data-editor class="mainEditor col-md-10"></textarea>', heightOfEditor);
}