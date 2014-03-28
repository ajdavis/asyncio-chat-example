import asyncio
import json
import traceback

import websockets

import eliza


@asyncio.coroutine
def chat(websocket, uri):
    try:
        print('open')
        while True:
            body = yield from websocket.recv()
            if body is None:
                print('close')
                return

            print(body)
            msg = json.loads(body).get('msg')
            response = {'msg': eliza.respond(msg)}
            yield from websocket.send(json.dumps(response))
    except Exception:
        traceback.print_exc()
        return

start_server = websockets.serve(chat, 'localhost', 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
