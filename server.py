import asyncio
import logging

from autobahn.asyncio.websocket import (WebSocketServerProtocol,
                                        WebSocketServerFactory)

clients = set()
logging.basicConfig(level=logging.INFO)


class ChatProtocol(WebSocketServerProtocol):
    def onConnect(self, request):
        clients.add(self)

    def onMessage(self, payload, is_binary):
        for c in clients.copy():
            if c is not self:
                try:
                    c.sendMessage(payload, is_binary)
                except Exception as e:
                    print(e)
                    clients.remove(c)

    def onClose(self, was_clean, code, reason):
        clients.remove(self)

factory = WebSocketServerFactory("ws://localhost:8765")
factory.protocol = ChatProtocol

loop = asyncio.get_event_loop()
asyncio.Task(loop.create_server(factory, port=8765))
loop.run_forever()
