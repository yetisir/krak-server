FROM kitware/paraview:pv-v5.8.0-osmesa-py3

RUN mkdir /opt/paraview/app
WORKDIR /opt/paraview/app

ENV PYTHONPATH=${PYTHONPATH}:/opt/paraview/lib/python3.6/site-packages

#temporary
RUN python -m pip install websocket-client 

CMD python server/pvw-server.py --port 1234

