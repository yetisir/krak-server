import logging
import sys
import os

from wslink import websocket as wsl
from wslink.upload import UploadPage

from autobahn.twisted.resource import WebSocketResource
from autobahn.twisted.websocket import listenWS, WebSocketServerFactory

from twisted.web import resource
from twisted.web.resource import Resource
from twisted.internet import reactor, protocol
from twisted.internet.defer import inlineCallbacks
from twisted.internet.endpoints import serverFromString
from twisted.python import log
from twisted.web.server import Site
from twisted.web.static import File

import server_protocols


def _handle_complex_resource_path(path, root, resource):
    # Handle complex endpoint. Twisted expects byte-type URIs.
    fullpath = path.encode('utf-8').split(b'/')
    parent_path_item_resource = root
    for path_item in fullpath:
        if path_item == fullpath[-1]:
            parent_path_item_resource.putChild(path_item, resource)
        else:
            new_resource = Resource()
            parent_path_item_resource.putChild(path_item, new_resource)
            parent_path_item_resource = new_resource


def _set_logging(debug):
    # redirect twisted logs to python standard logging.
    observer = log.PythonLoggingObserver()
    observer.start()

    if (debug):
        logging.basicConfig(level=logging.DEBUG)
    else:
        logging.basicConfig(level=logging.ERROR)


def _handle_file_upload(options, root):
    if options.uploadPath != None:
        uploadResource = UploadPage(options.uploadPath)
        root.putChild("upload", uploadResource)

    if len(options.fsEndpoints) > 3:
        for fsResourceInfo in options.fsEndpoints.split('|'):
            infoSplit = fsResourceInfo.split('=')
            _handle_complex_resource_path(
                infoSplit[0], root, File(infoSplit[1]))


def _websocket_server(options):
    # Websocket Server
    factory = wsl.TimeoutWebSocketServerFactory(
        url=f'ws://{options.host}:{options.port}', timeout=options.timeout)
    factory.protocol = wsl.WslinkWebSocketServerProtocol
    factory.setServerProtocol(
        server_protocols.WebSocketServerProtocol(options))

    root = Resource()

    # Handle possibly complex ws endpoint
    websocket_resource = WebSocketResource(factory)
    _handle_complex_resource_path(options.ws, root, websocket_resource)

    # Handle file uploads
    _handle_file_upload(options, root)

    site = Site(root)
    reactor.listenTCP(options.port, site)


def _tcp_server(options):
    factory = protocol.ServerFactory()
    factory.protocol = server_protocols.TCPSocketServerProtocol
    reactor.listenTCP(1235, factory)


def start(options):
    _set_logging(options.debug)

    _websocket_server(options)
    _tcp_server(options)

    reactor.callWhenRunning(
        lambda: log.msg('wslink: Starting factory', logLevel=logging.CRITICAL))

    # Start the reactor
    reactor.run()
