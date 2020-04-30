import time

from sqlalchemy import event
from sqlalchemy.orm import mapper
from sqlalchemy.exc import OperationalError
from config import app, connex_app, sql
import tables


def main():
    try:
        sql.create_all()
    except OperationalError:
        app.logger.info('Unable to connect to database Trying again in 1s ...')
        time.sleep(1)
        main()

    connex_app.add_api('openapi.yml')
    connex_app.run(host='0.0.0.0', port=5001, debug=True)

if __name__ == '__main__':
    main()
