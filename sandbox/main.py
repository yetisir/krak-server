import subprocess
import argparse
import zmq


def subscribe(ip="0.0.0.0", port=5550):
    url = f"tcp://{ip}:{port}"

    print(f"Going to bind to: {url}")
    context = zmq.Context()
    socket = context.socket(zmq.SUB)
    socket.bind(url)
    socket.setsockopt(zmq.SUBSCRIBE, ''.encode('ascii'))
    print("Sub bound to: {}\nWaiting for data...".format(url))

    while True:
        # wait for publisher data
        topic, message = socket.recv_multipart()
        print("On topic {topic}, received data: {message}")
        with open('temp.py', 'w') as f:
            f.write(message)

        subprocess.run('python temp.py')


if __name__ == "__main__":
    subscribe()
