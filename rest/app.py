import time
import logging

from sqlalchemy import event
from sqlalchemy.orm import mapper
from sqlalchemy.exc import OperationalError
from config import app, connex_app, sql
import tables


def main():

    # initialization loop just incase this server initializes before postgres
    try:
        sql.create_all()
    except OperationalError:
        logging.error('Unable to connect to database. Trying again ...')
        time.sleep(1)
        main()
    except KeyboardInterrupt:
        exit()

    connex_app.add_api('openapi.yml')
    connex_app.run(host='0.0.0.0', port=5001, debug=True)

if __name__ == '__main__':
    main()
