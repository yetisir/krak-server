import argparse
import zmq
import time


def publisher(ip="0.0.0.0", port=5550):
    # ZMQ connection
    url = f"tcp://{ip}:{port}"
    print("Going to connect to: {}".format(url))
    ctx = zmq.Context()
    socket = ctx.socket(zmq.PUB)
    socket.connect(url)  # publisher connects to subscriber
    print("Pub connected to: {}\nSending data...".format(url))

    topic = 'foo'.encode('ascii')
    msg = 'test '.encode('ascii')
    # publish data
    socket.send_multipart([topic, msg])  # 'test'.format(i)
    print("On topic {}, send data: {}".format(topic, msg))


publisher()
