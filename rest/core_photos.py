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


def read_cropped(borehole_id, core_photo_id):
    core_photo_id_match = (
        tables.CroppedCorePhoto.query
        .filter(tables.Borehole.id == borehole_id)
        .filter(tables.CroppedCorePhoto.core_photo_id == core_photo_id)
        .one_or_none()
    )

    if not core_photo_id_match:
        abort(404, f'Cropped Core photo id {core_photo_id} not found in borehole {borehole_id}')

    schema = tables.CroppedCorePhotoSchema()
    return schema.dump(core_photo_id_match)


def crop(body, borehole_id, core_photo_id):
    core_photo_id_match = (
        tables.CorePhoto.query
        .filter(tables.CorePhoto.id == core_photo_id)
        .one_or_none()
    )

    if not core_photo_id_match:
        abort(404, f'Cropped Core photo id {core_photo_id} not found')

    cropped_core_photo_id_match = (
        tables.CroppedCorePhoto.query
        .filter(tables.CroppedCorePhoto.core_photo_id == core_photo_id)
        .one_or_none()
    )

    if cropped_core_photo_id_match:
        abort(409, f'Core photo id {core_photo_id} already cropped')

    schema = tables.CroppedCorePhotoSchema()
    core_photo = schema.dump(core_photo_id_match)

    core_photo['core_photo_id'] = core_photo_id
    # * do photo cropping and get new hash and replace photo path below
    core_photo['file_hash'] = core_photo['file_hash']
    core_photo['file_name'] = core_photo['file_name']
    core_photo['file_path'] = core_photo['file_path']
    core_photo['mime_type'] = core_photo['mime_type']
    # ************************************************************

    cropped_core_photo = schema.load(core_photo)
    corner_schema = tables.CorePhotoCornerSchema(many=True)
    cropped_core_photo.core_photo_corners = corner_schema.load(body)
    sql.session.add(cropped_core_photo)
    sql.session.commit()

    return schema.dump(cropped_core_photo), 201


def update_crop(body, borehole_id, core_photo_id):
    abort(404, f'Core photo crop  update method not yet implemented')
