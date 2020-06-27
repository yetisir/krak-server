import json
import sys

import pyvista
import numpy as np

from paraview import simple
from paraview.web import pv_wslink
from paraview.web import protocols
# from twisted.internet import protocol
from twisted.protocols import basic
from autobahn.twisted.resource import WebSocketResource

import interface
import server


class WebSocketServerProtocol(pv_wslink.PVServerProtocol):

    def __init__(self, options, *args, **kwargs):
        self.authKey = options.authKey
        self.viewportScale = options.viewportScale
        self.viewportMaxWidth = options.viewportMaxWidth
        self.viewportMaxHeight = options.viewportMaxHeight
        self.settingsLODThreshold = options.settingsLODThreshold
        super().__init__(*args, **kwargs)

    def initialize(self):
        # Bring used components from ParaView
        self.registerVtkWebProtocol(
            protocols.ParaViewWebViewPort(
                self.viewportScale, self.viewportMaxWidth, self.viewportMaxHeight))
        self.registerVtkWebProtocol(
            protocols.ParaViewWebPublishImageDelivery(decode=False))
        self.registerVtkWebProtocol(interface.KrakProtocol())

        # Update authentication key to use
        self.updateSecret(self.authKey)

        # tell the C++ web app to use no encoding.
        # ParaViewWebPublishImageDelivery must be set to decode=False to match.
        self.getApplication().SetImageEncoding(0)

        # Disable interactor-based render calls
        view = simple.GetRenderView()
        view.EnableRenderOnInteraction = 0
        view.OrientationAxesVisibility = 0
        view.Background = [0.1, 0.1, 0.1]

        # ProxyManager helper
        pxm = simple.servermanager.ProxyManager()

        # Update interaction mode
        interactionProxy = pxm.GetProxy(
            'settings', 'RenderViewInteractionSettings')
        interactionProxy.Camera3DManipulators = [
            'Rotate', 'Pan', 'Zoom', 'Pan', 'Roll', 'Pan', 'Zoom',
            'Rotate', 'Zoom']

        # Custom rendering settings
        renderingSettings = pxm.GetProxy('settings', 'RenderViewSettings')
        renderingSettings.LODThreshold = self.settingsLODThreshold


class TCPSocketServerProtocol(basic.LineReceiver):

    MAX_LENGTH = 2**32

    def lineReceived(self, data):
        objects = json.loads(data)

        simple.ResetSession()
        for obj in objects:
            vtk_object = pyvista.UnstructuredGrid(
                np.array(obj['offset']),
                np.array(obj['cells']),
                np.array(obj['celltypes']),
                np.array(obj['points']),
            )

            paraview_connection = simple.TrivialProducer()
            paraview_connection.GetClientSideObject().SetOutput(vtk_object)

            simple.Show(paraview_connection)

        # TODO: Find beter way of communicating between classes
        import interface
        interface.KrakProtocol._object_graph = self.constructGraph(objects)

    def constructGraph(self, objects):
        object_graph = []
        for child in objects:
            child_name = child['name']
            object_graph.append({
                'data': {
                    'id': child_name,
                }
            })

            for parent in child['parents']:
                parent_name = parent['name']
                object_graph.append({
                    'data': {
                        'id': f'{parent_name}_{child_name}',
                        'source': parent_name,
                        'target': child_name,
                    }
                })
                object_graph.extend(self.constructGraph(child['parents']))

        return object_graph
