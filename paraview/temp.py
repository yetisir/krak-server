import sys, os, traceback, pandas

try:
    exec('(dfalksjdflkj =')

except  Exception as e:
    exc_type, exc_obj, exc_tb = sys.exc_info()
    tb = traceback.extract_tb(exc_tb)[-1]
    print(exc_type, tb)


