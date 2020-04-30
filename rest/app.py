import time

from sqlalchemy import event
from sqlalchemy.orm import mapper
from sqlalchemy.exc import OperationalError
from config import app, connex_app, sql
import tables

if __name__ == '__main__':
    sql.create_all()
    event.listen(mapper, 'after_configured', tables.setup_schema)
    connex_app.add_api('openapi.yml')
    connex_app.run(host='0.0.0.0', port=5001, debug=True)
