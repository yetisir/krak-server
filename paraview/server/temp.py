import krak

krak.Sphere()
krak.Sphere(center=(0, 0, 1))
krak.Cone(center=(0, 1, 0))
# async def hello():
#     uri = 'ws://0.0.0.0:1234/ws'
#     async with websockets.connect(uri) as websocket:

#         args = {
#             "wslink": "1.0",
#             "id": "12345678",
#             "method": "vtk.camera.reset",
#             "args": [],
#             "kwags": {},
#             }

#         await websocket.send(json.dumps(args))

#         response = await websocket.recv()
#         print(response)

# asyncio.get_event_loop().run_until_complete(hello())
