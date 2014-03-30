$(document).ready(function() {
    $('#messageform').on('submit', function() {
        newMessage($(this));
        return false;
    });
    $('#messageform').on('keypress', function(e) {
        if (e.keyCode == 13) {
            newMessage($(this));
            return false;
        }
    });
    $('#msg').select();
    updater.start();
});

function newMessage(form) {
    var msg = $('#msg').val();
    updater.showMessage(msg, false);
    $('#msg').val('').select();

    // Delay the response, for effect.
    setTimeout(function() {
        updater.socket.send(JSON.stringify({msg: msg}));
    }, 200);
}

var updater = {
    socket: null,

    start: function() {
        updater.setStatus('opening');

        var url = 'ws://localhost:8765/';
        var connected = false;

        // React to connection status periodically.
        function poll() {
            if (connected) return;

            // Reconnect.
            var ws = new WebSocket(url);

            // On state-change, display status and decide whether to reconnect.
            ws.onopen = ws.onclose = ws.onerror = function() {
                var code = ws.readyState;
                var codes = {
                    0: "opening",
                    1: "open",
                    2: "closing",
                    3: "closed"};

                updater.setStatus(codes[code]);
                connected = (code == 0 || code == 1);
            };

            ws.onmessage = function(event) {
                updater.showMessage(JSON.parse(event.data).msg, true);
            };

            // State is now "opening", although it may fail in the future.
            connected = true;
            updater.socket = ws;
        }

        setInterval(poll, 100);
    },

    setStatus: function(status) {
        $('#status').html(status);
    },

    showMessage: function(msg, isFromRemote) {
        // Including nbsp allows empty messages to appear as blank paragraphs.
        var node = $('<p>' + msg + '&nbsp;</p>');
        node.addClass('msg');
        node.addClass(isFromRemote ? 'remote': 'local');
        node.hide();
        $('#inbox').append(node);
        node.fadeIn();
    }
};
