from abc import ABC, abstractmethod
import json
import random

import websocket

uri = 'ws://0.0.0.0:1234/ws'


class KrakObject(ABC):

    def __init__(self, scene=None):
        self.websocket_connection = websocket.create_connection(uri)
        self._send()
        pass

    def _send(self):
        data = {
            'wslink': '1.0',
            'id': str(random.random()),
            'method': self.method,
            'args': [],
            'kwargs': self.kwargs}

        self.websocket_connection.send(json.dumps(data))

    def __del__(self):
        self.websocket_connection.close()

    # @property
    # @abstractmethod
    # def method(self):
    #     raise NotImplementedError

    # @property
    # @abstractmethod
    # def kwargs(self):
    #     raise NotImplementedError


class Sphere(KrakObject):
    def __init__(self, center=(0, 0, 0), radius=1):
        self.center = center
        self.radius = radius

        self.method = 'vtk.data.add_sphere'
        self.kwargs = {
            'Center': self.center,
            'Radius': self.radius,
        }

        super().__init__()


class Cone(KrakObject):
    def __init__(self, center=(0, 0, 0), radius=1, height=1):
        self.center = center
        self.radius = radius
        self.height = height

        self.method = 'vtk.data.add_cone'

        self.kwargs = {
            'Center': self.center,
            'Radius': self.radius,
            'Height': self.height,
        }

        super().__init__()
