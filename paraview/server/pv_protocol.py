import sys
from paraview.modules.vtkRemotingViews import vtkPVRenderView
from paraview.web import protocols as pv_protocols
from paraview import simple
from wslink import register as exportRpc
import os
import time
import logging

# from twisted.logger import Logger
log = logging.Logger('default')
log.setLevel(logging.DEBUG)
log.info('testing')

sphere = simple.Sphere()
cone = simple.Cone()


class ParaViewCone(pv_protocols.ParaViewWebProtocol):

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

    @exportRpc("vtk.initialize")
    def createVisualization(self):
        # simple.Show(cone)
        # simple.Show(sphere)
        return self.resetCamera()

    @exportRpc("vtk.data.add_sphere")
    def addSphere(self, **kwargs):
        log.warn(kwargs)
        simple.Show(simple.Sphere(**kwargs))

    @exportRpc("vtk.data.add_cone")
    def addCone(self, **kwargs):
        log.warn(kwargs)
        simple.Show(simple.Cone(**kwargs))

    @exportRpc("vtk.camera.reset")
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

    # @exportRpc("vtk.cone.resolution.update")
    # def updateResolution(self, resolution):
    #     cone.Resolution = resolution
    #     self.getApplication().InvokeEvent('UpdateEvent')

    @exportRpc("viewport.mouse.zoom.wheel")
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
