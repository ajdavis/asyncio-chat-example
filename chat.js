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
        var url = 'ws://localhost:8765/';
        var ws = new WebSocket(url);
        ws.onopen = ws.onclose = ws.onerr = function(event) {
            var codes = {
                0: "opening",
                1: "open",
                2: "closing",
                3: "closed"};

            $('#status').html(codes[updater.socket.readyState]);
        };

        ws.onmessage = function(event) {
            updater.showMessage(JSON.parse(event.data).msg, true);
        };

        updater.socket = ws;
    },

    showMessage: function(msg, isFromRemote) {
        var node = $('<p>' + msg + '&nbsp;</p>');
        node.addClass('msg');
        node.addClass(isFromRemote ? 'remote': 'local');
        node.hide();
        $('#inbox').append(node);
        node.fadeIn();
    }
};
