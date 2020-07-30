from abc import ABC, abstractmethod
import json
import random

from paraview import simple

uri = 'ws://0.0.0.0:1234/ws'

object_registry = {}


class KrakObject(ABC):

    def __init__(self, scene=None, type=None):
        # self.websocket_connection = websocket.create_connection(uri)
        # self._send()
        self.type = type
        object_registry[self.id] = self

    # def _send(self):
    #     data = {
    #         'wslink': '1.0',
    #         'id': str(random.random()),
    #         'method': self.method,
    #         'args': [],
    #         'kwargs': self.kwargs}

    #     self.websocket_connection.send(json.dumps(data))

    # def __del__(self):
    #     self.websocket_connection.close()

    # @property
    # @abstractmethod
    # def method(self):
    #     raise NotImplementedError

    # @property
    # @abstractmethod
    # def kwargs(self):
    #     raise NotImplementedError

class Hills(KrakObject):
    _id = 1

    def __init__(self):
        from pyvista import examples
        topo = examples.load_random_hills()

        from paraview import  simple

        tp = simple.TrivialProducer()
        tp.GetClientSideObject().SetOutput(topo)

        simple.Show(tp)

class Sphere(KrakObject):
    _id = 1

    def __init__(self, center=(0, 0, 0), radius=1):
        self.center = center
        self.radius = radius

        self.method = 'vtk.data.add_sphere'
        self.kwargs = {
            'Center': self.center,
            'Radius': self.radius,
        }
        simple.Show(simple.Sphere(**self.kwargs))
        self.id = f"sphere_{self._id}"
        Sphere._id += 1

        super().__init__(type='sphere')


class Cone(KrakObject):
    _id = 1

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
        simple.Show(simple.Cone(**self.kwargs))

        self.id = f"cone_{self._id}"
        Cone._id += 1

        super().__init__(type='cone')
