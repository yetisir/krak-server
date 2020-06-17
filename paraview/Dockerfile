FROM kitware/paraview:pv-v5.8.0-osmesa-py3

RUN mkdir /opt/paraview/app
WORKDIR /opt/paraview/app

ENV PYTHONPATH=${PYTHONPATH}:/opt/paraview/lib/python3.6/site-packages

#CMD python server/pvw-server.py --port 1234
CMD python server/pvw-server.py --port 1234

