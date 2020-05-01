import hashlib
import pathlib

from flask import make_response, abort

from config import sql, app
import tables


def read_all(borehole_id):
    boreholes = (
        tables.CorePhoto.query
        .filter(tables.CorePhoto.borehole_id == borehole_id)
        .all()
    )
    
    schema = tables.CorePhotoSchema(many=True)
    return schema.dump(boreholes)


def read_one(borehole_id, core_photo_id):
    core_photo_id_match = (
        tables.CorePhoto.query
        .filter(tables.Borehole.id == borehole_id)
        .filter(tables.CorePhoto.id == core_photo_id)
        .one_or_none()
    )

    if not core_photo_id_match:
        abort(404, f'Core photo id {core_photo_id} not found in borehole {borehole_id}')

    schema = tables.CorePhotoSchema()
    return schema.dump(core_photo_id_match)


def create(borehole_id, photo, body):

    core_photo = body.get('data')    
    core_photo_hash = hashlib.md5(photo.stream.read()).hexdigest()

    borehole_id_match = (
        tables.Borehole.query
        .filter(tables.Borehole.id == borehole_id)
        .one_or_none()
    )

    if not borehole_id_match:
        abort(404, f'Borehole id {borehole_id} not found')
    # core_photo_hash_match = (
    #     tables.CorePhoto.query
    #     .filter(tables.CorePhoto.file_hash == core_photo_hash)
    #     .one_or_none()
    # )
    # if core_photo_hash_match:
    #     abort(409, f'Core photo with hash {core_photo_hash} exists already')

    file_path = pathlib.Path('/var/lib/postgres_binary') / core_photo_hash

    core_photo['file_hash'] = core_photo_hash
    core_photo['file_name'] = photo.filename
    core_photo['file_path'] = file_path.as_posix()
    core_photo['mime_type'] = photo.mimetype
    core_photo['borehole_id'] = borehole_id

    photo.save(file_path.as_posix())


    schema = tables.CorePhotoSchema()
    new_core_photo = schema.load(core_photo)

    new_core_photo.hash = core_photo_hash

    sql.session.add(new_core_photo)
    sql.session.commit()

    return schema.dump(new_core_photo), 201


def update(body, borehole_id):
    abort(404, f'Core photo update method not yet implemented')


def delete(borehole_id, core_photo_id):
    core_photo_id_match = (
        tables.CorePhoto.query
        .filter(tables.CorePhoto.id == core_photo_id)
        .filter(tables.CorePhoto.borehole_id == borehole_id)
        .one_or_none()
    )

    if not core_photo_id_match:
        abort(404, f'Core photo id {core_photo_id} in borehole {borehole_id} not found')

    sql.session.delete(core_photo_id_match)
    sql.session.commit()
    return make_response(f'Core photo id {core_photo_id} deleted')
