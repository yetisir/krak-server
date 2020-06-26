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
        self.code = ''
        self.killed = False

    @register('vtk.set_background')
    def set_background(self, dark):
        view = simple.GetRenderView()
        if dark is True:
            color = [0.1, 0.1, 0.1]
        else:
            color = [0.9, 0.9, 0.9]
        view.Background = color

    @register('code.get')
    def get_code(self):
        return self.code

    @register('code.stop')
    def stop_code(self):
        try:
            self.sandbox.kill()
        except docker.errors.NotFound:
            pass
        self.killed = True

    @register('code.run')
    def run_code(self, code):
        self.code = code
        for source in simple.GetSources().values():
            simple.Delete(source)
        # simple.ResetSession()

        log.warn('spinning up container ...')

        client = docker.from_env()
        try:
            self.sandbox = client.containers.run(
                image='krak-server_sandbox',
                command=f'python -u -c "{code}"',
                detach=True,
                network='krak-server_default',
                remove=True,
            )
            self.publish('code.set_status', 'running')

        except Exception as e:
            log.error(e)
            return

        log.warn('created container')
        self.stdout_generator = self.sandbox.logs(
            stream=True, stdout=True, stderr=False)
        self.stderr_generator = self.sandbox.logs(
            stream=True, stderr=True, stdout=False)

    @register('code.push_output')
    def push_output(self):
        reactor.callInThread(self._push_output)

    def _push_output(self):
        while 1:
            try:
                self.sandbox.reload()
                for output in self.stdout_generator:
                    log.warn('stdout: ' + output.decode())
                for output in self.stderr_generator:
                    log.warn('stderr: ' + output.decode())
                    self.publish('code.set_status', 'error')
                    return
            except docker.errors.APIError:
                if self.killed:
                    self.killed = False
                    self.publish('code.set_status', 'killed')
                else:
                    self.publish('code.set_status', 'completed')
                return

    @register('code.status')
    def code_status(self):
        try:
            self.sandbox.reload()
            status = self.sandbox.status
            return status
        except docker.errors.APIError:
            return 'completed'

    # @register('data.objects')
    # def getKrakObjects(self):
    #     objects = []
    #     # for obj in krak.object_registry.values():
    #     #     objects.append({
    #     #         'id': obj.id,
    #     #         'type': obj.type,
    #     #         'kwargs': obj.kwargs,
    #     #     })
    #     # log.warn(objects)
    #     return objects

    @register("vtk.reset_camera")
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
            # rootId = viewProxy.GetGlobalIDAsString()
            zoomFactor = 1.0 - event['spinY'] / 10.0

            # if rootId in self.linkedViews:
            #     fp = viewProxy.CameraFocalPoint
            #     pos = viewProxy.CameraPosition
            #     delta = [fp[i] - pos[i] for i in range(3)]
            #     viewProxy.GetActiveCamera().Zoom(zoomFactor)
            #     viewProxy.UpdatePropertyInformation()
            #     pos2 = viewProxy.CameraPosition
            #     viewProxy.CameraFocalPoint = [
            #         pos2[i] + delta[i] for i in range(3)]
            #     dstViews = [self.getView(vid) for vid in self.linkedViews]
            #     pushCamera(viewProxy, dstViews)
            # else:
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
