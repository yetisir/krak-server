import json
import os
import sys

from twisted.internet import reactor
from twisted.web.server import Site
from twisted.python import log
from twisted.web.static import File


from wslink.websocket import ServerProtocol, TimeoutWebSocketServerFactory, WslinkWebSocketServerProtocol
from autobahn.twisted.resource import WebSocketResource

import protocol


class ExampleServer(ServerProtocol):
    def initialize(self):
        self.protocol = protocol.MyProtocol()
        self.registerLinkProtocol(self.protocol)
        self.updateSecret("wslink-secret")

    def pushImage(self):
        self.protocol.pushImage()


# -----------------------------------------------------------------------------
# Web server definition
# -----------------------------------------------------------------------------

log.startLogging(sys.stdout)

# Warning if client examples haven't been built.
clientDir = os.path.join(os.path.dirname(__file__), "../../js/dist/examples")
if not os.path.exists(clientDir) or not os.path.exists(os.path.join(clientDir, "index.html")):
    print("Example client hasn't been built, please run 'npm run build:example' in ../js ")

exampleServer = ExampleServer()

# Static file delivery
root = File(clientDir)

# WS endpoint. Use timeout=0 to never timeout the server.
factory = TimeoutWebSocketServerFactory(url=u"ws://0.0.0.0:8080", timeout=60)
factory.protocol = WslinkWebSocketServerProtocol
factory.setServerProtocol(exampleServer)
resource = WebSocketResource(factory)
root.putChild(b"ws", resource)

# a test for publishing before a connection is made:
# reactor.callLater(2, exampleServer.pushImage)

# WebServer
print("launching webserver")
site = Site(root)
reactor.listenTCP(8888, site)
reactor.run()
