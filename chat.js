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
        updater.socket = new WebSocket(url);
        updater.socket.onmessage = function(event) {
            updater.showMessage(JSON.parse(event.data).msg, true);
        }
    },

    showMessage: function(msg, isFromRemote) {
        var node = $('<p>' + msg + '</p>');
        node.addClass('msg');
        node.addClass(isFromRemote ? 'remote': 'local');
        node.hide();
        $('#inbox').append(node);
        node.fadeIn();
    }
};
