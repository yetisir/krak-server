import argparse
import os

import server


def get_parser():
    # TODO: Move to ENV variables
    parser = argparse.ArgumentParser(
        description="KraK Render Server")
    parser.add_argument(
        "-d", "--debug",
        help="log debugging messages to stdout",
        action="store_true")
    parser.add_argument(
        "-i", "--host", type=str, default='localhost',
        help="the interface for the web-server to listen on (default: localhost)")
    parser.add_argument(
        "-p", "--port", type=int, default=8080,
        help="port number for the web-server to listen on (default: 8080)")
    parser.add_argument(
        "-t", "--timeout", type=int, default=300,
        help="timeout for reaping process on idle in seconds (default: 300s)")
    parser.add_argument(
        "-a", "--authKey", default='wslink-secret',
        help="Authentication key for clients to connect to the WebSocket.")
    parser.add_argument(
        "-f", "--force-flush", default=False,
        help="If provided, this option will force additional padding content to the output.  Useful when application is triggered by a session manager.",
        dest="forceFlush", action='store_true')
    parser.add_argument(
        "-ws", "--ws-endpoint", type=str, default="ws", dest='ws',
        help="Specify WebSocket endpoint. (e.g. foo/bar/ws, Default: ws)")
    parser.add_argument(
        "--fs-endpoints", default='', dest='fsEndpoints',
        help="add another fs location to a specific endpoint (i.e: data=/Users/seb/Download|images=/Users/seb/Pictures)")

    # VTK/PV specific args
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

    # Extract any necessary upload server arguments
    parser.add_argument(
        "--upload-directory", default=os.getcwd(),
        help="path to root upload directory", dest="uploadPath")

    return parser


if __name__ == "__main__":
    # Create argument parser
    parser = get_parser()
    args = parser.parse_args()

    # Start server
    server.start(options=args)
