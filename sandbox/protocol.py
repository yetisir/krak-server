import os

from wslink import register
from wslink.websocket import LinkProtocol
from twisted.internet import task

class CodeExecutionProtocol(LinkProtocol):
    def __init__(self):
        super().__init__()

    @register('code.run')
    def run(self, code):


class MyProtocol(LinkProtocol):
    def __init__(self):
        super(MyProtocol, self).__init__()
        self.loopTask = None
        self.topic = "image"
        self.subscribers = 0
        self.subMsgCount = 0

    @register("myprotocol.add")
    def add(self, listOfNumbers):
        if (type(listOfNumbers) is list):
            result = 0
            for value in listOfNumbers:
                result += value
            return result

        # How should a client return an error? Probably throw()
        print("Unexpected arg", listOfNumbers)
        return 0

    @register("myprotocol.mult")
    def mult(self, listOfNumbers):
        if (type(listOfNumbers) is list):
            result = 1
            for value in listOfNumbers:
                result *= value
            return result

        print("Unexpected arg", listOfNumbers)
        return 0

    @register("myprotocol.image")
    def image(self, alt=False):
        filename = "kitware.png" if not alt else "kitware2.png"
        filename = os.path.join(os.path.dirname(__file__), filename)
        with open(filename, mode='rb') as file:
            contents = file.read()
            return {"blob": self.addAttachment(contents)}

    @register("myprotocol.unwrapped.image")
    def bareImage(self, alt=False):
        filename = "kitware.png" if not alt else "kitware2.png"
        filename = os.path.join(os.path.dirname(__file__), filename)
        with open(filename, mode='rb') as file:
            contents = file.read()
            return self.addAttachment(contents)

    def pushImage(self):
        print("push image", self.subMsgCount)
        msg = self.image(self.subMsgCount % 2 is 0)
        # publish binary message.
        self.publish(self.topic, msg)
        self.subMsgCount += 1

    @register("myprotocol.postbinary")
    def postBinary(self, data):
        return "received binary data of length %d" % len(data)

    @register("myprotocol.stream")
    def startStream(self, topic):
        print("start", topic)
        # set up repeated send of images until unsubscribed.
        # http://twistedmatrix.com/documents/current/core/howto/time.html
        if not self.loopTask:
            self.loopTask = task.LoopingCall(self.pushImage)
            self.loopTask.start(2.0)
        self.topic = topic
        self.subscribers += 1
        return {"subscribed": topic}

    @register("myprotocol.stop")
    def stopStream(self, topic):
        print("stop", topic)
        if self.topic == topic and self.subscribers > 0:
            self.subscribers -= 1
            if self.subscribers == 0 and self.loopTask:
                self.loopTask.stop()
                self.loopTask = None
            return {"unsubscribed": topic}
        return 0

    # test nesting attachments
    @register("myprotocol.nested.image")
    def testNesting(self):
        img = self.image()
        # just using 'bytes' only works in Py3
        bytes_list1 = bytes(bytearray([1, 2, 3, 4]))
        bytes_list2 = bytes(bytearray([5, 6, 7, 8, 9, 10]))
        msg = {
            "image": img,
            "bytesList": [
                self.addAttachment(bytes_list1),
                self.addAttachment(bytes_list2),
            ]
        }
        return msg

    # test NaN and infinity
    @register("myprotocol.special")
    def testSpecials(self, listOfNumbers):
        vals = [float('inf'), float('nan'), float('-inf')]
        return vals
