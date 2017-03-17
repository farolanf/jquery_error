// transcribe.js
// Serves as a basis for the Transcribify Editor
$(document).ready(function() {
    var htmlPlayer = document.getElementById("audioPlayer");
    var val = 1;
    var modifiedSpeakerValue;
    var speakers = ['Speaker 1'];
    var player = new MediaElementPlayer('#audioPlayer', {
        audioWidth: 400,
        // height of audio player
        audioHeight: 30,
        // initial volume when the player starts
        startVolume: 0.8,
        // useful for <audio> player loops
        loop: false,
        // enables Flash and Silverlight to resize to content size
        enableAutosize: true,
        // the order of controls you want on the control bar (and other plugins below)
        features: [],
        // Hide controls when playing and mouse is not over the video
        alwaysShowControls: false,
        // force iPad's native controls
        iPadUseNativeControls: false,
        // force iPhone's native controls
        iPhoneUseNativeControls: false,
        // force Android's native controls
        AndroidUseNativeControls: false,
        // forces the hour marker (##:00:00)
        alwaysShowHours: false,
        // show framecount in timecode (##:00:00:00)
        showTimecodeFrameCount: false,
        // used when showTimecodeFrameCount is set to true
        framesPerSecond: 25,
        // turns keyboard support on and off for this instance
        enableKeyboard: true,
        // when this player starts, it will pause other players
        pauseOtherPlayers: true,
        // array of keyboard commands
        keyActions: [{
            keys: [32],
            action: function(player, media) {
                console.log("SPCE PRESSED")
                media.pause();
            }
        }]
    });
    $("#play").click(function() {
        player.play();
    });
    $("#pause").click(function() {
        player.pause();
    });
    $("#back").click(function() {
        var newTime = Math.max(htmlPlayer.currentTime - 4);
        htmlPlayer.setCurrentTime(newTime);
        // go back by x seconds
    });
    $("#submitSettingsChanges").click(function() {
        // tell server that transcriber is changing settings
        var goBackTime = $("#goBackTime").val();
        var goForwardTime = $("#goForwardTime").val();
        var goBackShortcut = $("#shortcutToGoBack").val();
        var goForwardShortcut = $("#goForwardShortcut").val();
        alert(goBackTime + " " + goForwardTime + " " + goBackShortcut + " " + goForwardShortcut)
        post("/transcriberSettingsSave", {
            goBackAmount: goBackTime,
            goForwardAmount: goForwardTime,
            goBackShortcut: goBackShortcut,
            playbackShortcut: goForwardShortcut
        });
    });
    $(document).on('click', ".addNew", function() {
        $("#addNewSpeakerModal").modal('show');
        modifiedSpeakerValue = $(this).data('val');
        $("#speakerIdValue").val(modifiedSpeakerValue);
    });
    $("#settingsBtn").click(function() {
        $("#updateSettingsModal").modal('show');
    })
    $("#addNewSpeakerSubmit").click(function() {
        addNewSpeaker($("#addNewSpeakerInput").val());
        closeModals();
        // todo change speaker id as well
    });
    $(document).on('click', ".dropdown-menu li a", function() {
        if ($(this).text() != "Add New Speaker") {
            $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
            $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
        }
    });

    function addNewSpeaker(speakerName) {
        speakers.push(speakerName);
        $(".dropdown-menu").each(function() {
            $(this).append('<li role="presentation"><a role="menuitem" tabindex="-1" href="#" data-value="' +
                speakerName + '">' + speakerName + '</a></li>');
        });
        $(".dropdown-menu[data-val=" + modifiedSpeakerValue + "]").parents(".dropdown").find('.btn').html(speakerName + ' <span class="caret"></span>');
    }
    addNewEditor();
    // Begin Ace implementation
    // Take advantage of https://github.com/Automattic/atd-jquery for spellcheck, or (paid) look into https://textgears.com/api/#pricing
    // also add time/currtime to top of editor
    setInterval(save, 5000);
    // Handle new speaker label
    // TODO handle removing of speaker label
    var start = 0;
    $(document).keyup(function(e) {
        // consider using https://dmauro.github.io/Keypress/
        if (e.keyCode == 13) {
            elapsed = new Date().getTime();
            if (elapsed - start <= 5000) {
                addNewEditor();
            } else {
                start = elapsed;
            }
            start = elapsed;
        }
    });

    function closeModals() {
        $(".modal").each(function() {
            $(this).modal('hide');
        });
    }

    function findLast2Speakers(currentVal) {
        if (currentVal < 3) {
            addNewSpeaker("Speaker 2");
        } else {
            var pastTwo = currentVal - 1;
            var pastSpeakerName = $(".dropdown-menu[data-val=" + pastTwo + "]").parents(".dropdown").find('.btn').html();
            // set speaker label to pastSpeakerName
        }
    }

    /*$(".addNew").click(function() {
        console.log("Add new clicked")
        $("#addNewSpeakerModal").modal();
    });*/
    // Handle submission
    function submitProject() {
        // for each data-val, loop through, check value of Speaker dropdown and value of editor
        // add those all together, convert them to a doc and done!
    }
    // Handle autosave
    function save() {
        // post to server with project id and transcriber id, looping through info and saving changes
    }

    function updateEditors(height) {
        var i = 0;
        $('div.mainEditor').remove();
        $('textarea[data-editor]').each(function() {
            var textarea = $(this);
            var mode = textarea.data('editor');
            var editDiv = $('<div>', {
                position: 'relative',
                // width: textarea.width(),
                width: '100%',
                height: textarea.height(),
                'class': textarea.attr('class') // modify these to include the Row div
            }).insertBefore(textarea);
            editDiv.attr('data-val', '' + val + '');
            textarea.hide();
            $('div.mainEditor:not(.ace_editor)').each(function() {
                var editor = ace.edit(this);
                // alert('ace.edit' + (i))
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
            });
            i++;
        });
    }

    function addNewEditor() {
        // handle add speakers
        addSpeakerLabels(function(done) {
            $("body").append(done);
           updateEditors();
            //updateEditors(height);
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
                'type="button" data-toggle="dropdown">Speaker 1 <span class="caret"></span></button>';
        } else {
            beginning = '<div class="row" data-val="' +
                val + '"><div class="speaker col-md-1"><div class="dropdown">' +
                '<button class="btn btn-primary dropdown-toggle" type="button"' +
                ' data-toggle="dropdown">Speaker 1 <span class="caret"></span></button>';
        }
        var htmlToAdd = '<ul class="dropdown-menu" data-val="' + val + '"' +
            'aria-labelledby="menu1"><li role="presentation">' +
            '<a role="menuitem" tabindex="-1" class="addNew" data-val="' + val + '" href="#">Add New Speaker</a></li>';
        speakers.forEach(function(speaker) {
            htmlToAdd = htmlToAdd + '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" data-value="' + speaker + '">' + speaker + '</a></li>';
        });
        htmlToAdd = htmlToAdd + "</ul>";
        done(beginning + htmlToAdd + '</div></div><div class="col-md-10"><textarea data-val=' +
            val + ' data-editor class="mainEditor"></textarea></div></div>', heightOfEditor);
    }

    function post(path, params, method) {
        event.preventDefault();
        $.post(path, params, function(resp) {
            closeModals();
        });
    }
});