import asyncio
import logging

# https://pypi.python.org/pypi/websockets
import websockets

clients = set()
logging.basicConfig(level=logging.INFO)


@asyncio.coroutine
def chat(websocket, uri):
    clients.add(websocket)
    while True:
        msg = yield from websocket.recv()
        if msg is None:
            return

        print(msg)
        for client in clients.copy():
            if client is not websocket:
                try:
                    yield from client.send(msg)
                except websockets.exceptions.InvalidState:
                    clients.remove(client)

start_server = websockets.serve(chat, 'localhost', 8765)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
