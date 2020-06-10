import sys

from twisted.internet import reactor
from twisted.python import log

from autobahn.twisted.websocket import WebSocketClientFactory, \
    WebSocketClientProtocol, \
    connectWS


class PingClientProtocol(WebSocketClientProtocol):

    def onOpen(self):
        self.pingsReceived = 0
        self.pongsSent = 0

    def onClose(self, wasClean, code, reason):
        reactor.stop()

    def onPing(self, payload):
        self.pingsReceived += 1
        print("Ping received from {} - {}".format(self.peer, self.pingsReceived))
        self.sendPong(payload)
        self.pongsSent += 1
        print("Pong sent to {} - {}".format(self.peer, self.pongsSent))

    def onConnect(self, response):
        print("Server connected: {0}".format(response.peer))

    def onConnecting(self, transport_details):
        print("Connecting; transport details: {}".format(transport_details))
        return None  # ask for defaults

    def onOpen(self):
        print("WebSocket connection open.")

        def hello():
            self.sendMessage("Hello, world!".encode('utf8'))
            self.sendMessage(b"\x00\x01\x03\x04", isBinary=True)
            self.factory.reactor.callLater(1, hello)

        # start sending messages every second ..
        hello()

    def onMessage(self, payload, isBinary):
        if isBinary:
            print("Binary message received: {0} bytes".format(len(payload)))
        else:
            print("Text message received: {0}".format(payload.decode('utf8')))

    def onClose(self, wasClean, code, reason):
        print("WebSocket connection closed: {0}".format(reason))


if __name__ == '__main__':

    log.startLogging(sys.stdout)

    factory = WebSocketClientFactory('ws://0.0.0.0:1234/ws')
    factory.protocol = PingClientProtocol
    connectWS(factory)

    reactor.run()
