FROM kitware/paraview:pv-v5.8.0-osmesa-py3

RUN mkdir /opt/paraview/app
WORKDIR /opt/paraview/app

ENV PYTHONPATH=${PYTHONPATH}:/opt/paraview/lib/python3.6/site-packages

RUN python -m pip install pyvista
RUN python -m pip install docker

COPY server/* server/

CMD python server/main.py --port 1234

