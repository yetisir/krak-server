import logging
import sys
import json

# from paraview.modules.vtkRemotingViews import vtkPVRenderView
from paraview.web import protocols
from paraview import simple
from wslink import register

from twisted.internet import task, reactor

import docker

log = logging.Logger('default')
log.setLevel(logging.DEBUG)
log.info('testing')


class KrakProtocol(protocols.ParaViewWebProtocol):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.sandbox = None

    @register("vtk.initialize")
    def createVisualization(self):
        simple.Show(simple.Sphere())
        return self.resetCamera()

    @register('vtk.background.set')
    def set_background(self, dark):
        view = simple.GetRenderView()
        if dark is True:
            color = [0.1, 0.1, 0.1]
        else:
            color = [0.9, 0.9, 0.9]
        view.Background = color

    @register('code.stop')
    def stop_code(self):
        try:
            self.sandbox.kill()
        except docker.errors.NotFound:
            pass
        self.publish('code.set_status', 'killed')

    @register('code.run')
    def run_code(self, text):
        # for source in simple.GetSources().values():
        #     simple.Hide(source)
        # simple.ResetSession()

        log.warn('spinning up container ...')

        # temporary - still insecure
        client = docker.from_env()
        try:
            self.sandbox = client.containers.run(
                image='krak-server_sandbox',
                command=f'python -u -c "{text}"',
                detach=True,
                # stream=True,
                network='krak-server_default',
                remove=True,
            )
            self.publish('code.set_status', 'running')

        except Exception as e:
            log.error(e)
            return

        log.warn('created container')
        self.output_generator = self.sandbox.logs(stream=True)

        # self.push_output()

    @register('code.push_output')
    def push_output(self):

        reactor.callInThread(self._push_output)

    def _push_output(self):
        try:
            self.sandbox.reload()
            # output = self.output_generator.__next__().decode().strip()
            for output in self.output_generator:
                log.warn(output)
            self.push_output()
        except docker.errors.APIError:
            # self.push_loop.stop()
            self.publish('code.set_status', 'exited')

    @register('code.status')
    def code_status(self):

        # log.warn('bigbig')
        # self.publish('code.stdout', 'bigbigbig')

        try:
            self.sandbox.reload()
            status = self.sandbox.status
            return status
        except Exception:  # TODO: usea proper exception
            return 'exited'

    @register('data.objects')
    def getKrakObjects(self):
        objects = []
        # for obj in krak.object_registry.values():
        #     objects.append({
        #         'id': obj.id,
        #         'type': obj.type,
        #         'kwargs': obj.kwargs,
        #     })
        # log.warn(objects)
        return objects

    @register("vtk.camera.reset")
    def resetCamera(self):
        view = self.getView('-1')
        simple.Render(view)
        simple.ResetCamera(view)
        try:
            view.CenterOfRotation = view.CameraFocalPoint
        except:
            pass

        self.getApplication().InvalidateCache(view.SMProxy)
        self.getApplication().InvokeEvent('UpdateEvent')

        return self.getCamera()

    @register("viewport.mouse.zoom.wheel")
    def updateZoomFromWheel(self, event):
        if 'Start' in event["type"]:
            self.getApplication().InvokeEvent('StartInteractionEvent')

        viewProxy = self.getView(event['view'])
        if viewProxy and 'spinY' in event:
            rootId = viewProxy.GetGlobalIDAsString()
            zoomFactor = 1.0 - event['spinY'] / 10.0

            if rootId in self.linkedViews:
                fp = viewProxy.CameraFocalPoint
                pos = viewProxy.CameraPosition
                delta = [fp[i] - pos[i] for i in range(3)]
                viewProxy.GetActiveCamera().Zoom(zoomFactor)
                viewProxy.UpdatePropertyInformation()
                pos2 = viewProxy.CameraPosition
                viewProxy.CameraFocalPoint = [
                    pos2[i] + delta[i] for i in range(3)]
                dstViews = [self.getView(vid) for vid in self.linkedViews]
                pushCamera(viewProxy, dstViews)
            else:
                fp = viewProxy.CameraFocalPoint
                pos = viewProxy.CameraPosition
                delta = [fp[i] - pos[i] for i in range(3)]
                viewProxy.GetActiveCamera().Zoom(zoomFactor)
                viewProxy.UpdatePropertyInformation()
                pos2 = viewProxy.CameraPosition
                viewProxy.CameraFocalPoint = [
                    pos2[i] + delta[i] for i in range(3)]

        if 'End' in event["type"]:
            self.getApplication().InvokeEvent('EndInteractionEvent')

    def getCamera(self):
        view = self.getView('-1')
        bounds = [-1, 1, -1, 1, -1, 1]

        if view and view.GetClientSideView().GetClassName() == 'vtkPVRenderView':
            rr = view.GetClientSideView().GetRenderer()
            bounds = rr.ComputeVisiblePropBounds()

        return {
            'id': view.GetGlobalIDAsString(),
            'bounds': bounds,
            'position': tuple(view.CameraPosition),
            'viewUp': tuple(view.CameraViewUp),
            'focalPoint': tuple(view.CameraFocalPoint),
            'centerOfRotation': tuple(view.CenterOfRotation),
        }
