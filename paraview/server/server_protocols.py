from paraview import simple
from paraview.web import pv_wslink
from paraview.web import protocols

from twisted.internet import protocol

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


class TCPSocketServerProtocol(protocol.Protocol):
    def dataReceived(self, data):
        "As soon as any data is received, write it back."
        print(data)
        self.transport.write(data)
