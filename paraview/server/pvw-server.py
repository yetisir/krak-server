r"""
    This module is a ParaViewWeb server application.
    The following command line illustrates how to use it::

        $ pvpython -dr /.../pvw-server.py

    Any ParaViewWeb executable script comes with a set of standard arguments that can be overriden if need be::

        --port 8080
             Port number on which the HTTP server will listen.

        --content /path-to-web-content/
             Directory that you want to serve as static web content.
             By default, this variable is empty which means that we rely on another
             server to deliver the static content and the current process only
             focuses on the WebSocket connectivity of clients.

        --authKey vtkweb-secret
             Secret key that should be provided by the client to allow it to make
             any WebSocket communication. The client will assume if none is given
             that the server expects "vtkweb-secret" as secret key.

"""

# import to process args
import os
import sys
import argparse

from paraview import simple
from paraview.web import pv_wslink
from paraview.web import protocols

# import RPC annotation
from wslink import register
from wslink import server

import pv_protocol

# import argparse

# =============================================================================
# Create custom Pipeline Manager class to handle clients requests
# =============================================================================


class Server(pv_wslink.PVServerProtocol):

    @staticmethod
    def configure(settings):
        Server.authKey = settings.authKey
        Server.viewportScale = settings.viewportScale
        Server.viewportMaxWidth = settings.viewportMaxWidth
        Server.viewportMaxHeight = settings.viewportMaxHeight
        Server.settingsLODThreshold = settings.settingsLODThreshold

    def initialize(self):
        # Bring used components from ParaView
        self.registerVtkWebProtocol(
            protocols.ParaViewWebViewPort(
                Server.viewportScale,
                Server.viewportMaxWidth,
                Server.viewportMaxHeight,
            ))
        self.registerVtkWebProtocol(
            protocols.ParaViewWebPublishImageDelivery(decode=False))

        # Bring used components from ParaView Lite
        self.registerVtkWebProtocol(
            pv_protocol.ParaViewCone())

        # Update authentication key to use
        self.updateSecret(Server.authKey)

        # tell the C++ web app to use no encoding. ParaViewWebPublishImageDelivery must be set to decode=False to match.
        self.getApplication().SetImageEncoding(0)

        # Disable interactor-based render calls
        view = simple.GetRenderView()
        view.EnableRenderOnInteraction = 0
        view.OrientationAxesVisibility = 0
        view.Background = [0.5, 0.5, 0.5]

        # ProxyManager helper
        pxm = simple.servermanager.ProxyManager()

        # Update interaction mode
        interactionProxy = pxm.GetProxy(
            'settings', 'RenderViewInteractionSettings')
        interactionProxy.Camera3DManipulators = [
            'Rotate', 'Pan', 'Zoom', 'Pan', 'Roll', 'Pan', 'Zoom', 'Rotate', 'Zoom']

        # Custom rendering settings
        renderingSettings = pxm.GetProxy('settings', 'RenderViewSettings')
        renderingSettings.LODThreshold = Server.settingsLODThreshold


if __name__ == "__main__":
    # Create argument parser
    parser = argparse.ArgumentParser(
        description="ParaView Cone Sample application")
    parser.add_argument(
        "--virtual-env", default=None,
        help="Path to virtual environment to use")
    parser.add_argument(
        "--viewport-scale", default=1.0, type=float,
        help="Viewport scaling factor", dest="viewportScale")
    parser.add_argument(
        "--viewport-max-width", default=2560, type=int,
        help="Viewport maximum size in width", dest="viewportMaxWidth")
    parser.add_argument(
        "--viewport-max-height", default=1440, type=int,
        help="Viewport maximum size in height", dest="viewportMaxHeight")
    parser.add_argument(
        "--settings-lod-threshold", default=102400, type=int,
        help="LOD Threshold in Megabytes", dest="settingsLODThreshold")

    # # Add arguments
    server.add_arguments(parser)

    args = parser.parse_args()
    Server.configure(args)

    # Start server
    server.start_webserver(options=args, protocol=Server)
