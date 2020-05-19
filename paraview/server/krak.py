import websocket
import json
import random


class KrakObject:
    objects = []
    uri = 'ws://0.0.0.0:1234/ws'

    websocket_connection = websocket.create_connection(uri)

    def __init__(self):

        self.objects.append(self)
        self._send()

    def _send(self):
        self.websocket_connection.send(json.dumps(self.data))

    def __del__(self):
        self.websocket_connection.close()


class Sphere(KrakObject):
    def __init__(self, center=(0, 0, 0), radius=1):
        self.center = center
        self.radius = radius

        self.data = {
            'wslink': '1.0',
            'id': str(random.random()),
            'method': 'vtk.data.add_sphere',
            'args': [],
            'kwargs': {
                'Center': self.center,
                'Radius': self.radius,
            }
        }
        super().__init__()


class Cone(KrakObject):
    def __init__(self, center=(0, 0, 0), radius=1, height=1):
        self.center = center
        self.radius = radius
        self.height = height

        self.data = {
            'wslink': '1.0',
            'id': str(random.random()),
            'method': 'vtk.data.add_cone',
            'args': [],
            'kwargs': {
                'Center': self.center,
                'Radius': self.radius,
                'Height': self.height,
            }
        }
        super().__init__()
