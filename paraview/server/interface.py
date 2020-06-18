import logging


# from paraview.modules.vtkRemotingViews import vtkPVRenderView
from paraview.web import protocols
from paraview import simple
from wslink import register

import krak

log = logging.Logger('default')
log.setLevel(logging.DEBUG)
log.info('testing')


class KrakProtocol(protocols.ParaViewWebProtocol):

    @register("vtk.initialize")
    def createVisualization(self):
        return self.resetCamera()


    @register('vtk.background.set')
    def set_background(self, dark):
        view = simple.GetRenderView()
        if dark is True:
            color = [0.1, 0.1, 0.1]
        else:
            color = [0.9, 0.9, 0.9]
        view.Background = color


    @register("code.run")
    def runCode(self, text):
        log.warn(text)
        for source in simple.GetSources().values():
            simple.Hide(source)
        simple.ResetSession()

        # temporary highly insecure
        krak.object_registry = {}

        exec(text)

    @register('data.objects')
    def getKrakObjects(self):
        objects = []
        for obj in krak.object_registry.values():
            objects.append({
                'id': obj.id,
                'type': obj.type,
                'kwargs': obj.kwargs,
            })
        log.warn(objects)
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
