from sqlalchemy.dialects import postgresql
from sqlalchemy.schema import CreateTable
from sqlalchemy.orm import mapper
from marshmallow_sqlalchemy import fields

from config import sql, ma


def schema_metadata(cls):
    class Meta:
        model = cls
        load_instance=True
        sqla_session = sql.session
        include_fk = True
        include_relationships = True
    return Meta


class Survey(sql.Model):
    __tablename__ = 'survey'

    id = sql.Column(sql.Integer(), primary_key=True)
    borehole_id = sql.Column(sql.Integer(), sql.ForeignKey('borehole.id'))
    depth = sql.Column(sql.Float(), nullable=False)
    azimuth = sql.Column(sql.Float(), nullable=False)
    dip = sql.Column(sql.Float(), nullable=False)


class SurveySchema(ma.SQLAlchemyAutoSchema):
    Meta = schema_metadata(Survey)


class CorePhotoCorner(sql.Model):
    __tablename__ = 'core_photo_corner'

    id = sql.Column(sql.Integer, primary_key=True)
    cropped_core_photo_id = sql.Column(
        sql.Integer, sql.ForeignKey('cropped_core_photo.id'))
    top = sql.Column(sql.Float(), nullable=False)
    left = sql.Column(sql.Float(), nullable=False)


class CorePhotoCornerSchema(ma.SQLAlchemyAutoSchema):
    Meta = schema_metadata(CorePhotoCorner)


class CroppedCorePhoto(sql.Model):
    __tablename__ = 'cropped_core_photo'

    id = sql.Column(sql.Integer(), primary_key=True)
    file_path = sql.Column(sql.String(512), nullable=False)
    mime_type = sql.Column(sql.String, nullable=False)
    core_photo_id = sql.Column(sql.Integer(),
        sql.ForeignKey('core_photo.id'), nullable=False)
    borehole_id = sql.Column(sql.Integer(),
        sql.ForeignKey('borehole.id'), nullable=False)

    core_photo_corners = sql.relationship(
        CorePhotoCorner,
        backref='cropped_core_photo',
        cascade='all, delete, delete-orphan',
        single_parent=True,
    )

class CroppedCorePhotoSchema(ma.SQLAlchemyAutoSchema):
    Meta = schema_metadata(CroppedCorePhoto)
    core_photo_corners = fields.Nested(
        CorePhotoCornerSchema, many=True,
        exclude=('id', 'cropped_core_photo_id'))


class CorePhoto(sql.Model):
    __tablename__ = 'core_photo'

    id = sql.Column(sql.Integer(), primary_key=True)
    file_hash = sql.Column(sql.String(), nullable=False)
    file_path = sql.Column(sql.String(512), nullable=False)
    file_name = sql.Column(sql.String(128), nullable=False)
    mime_type = sql.Column(sql.String, nullable=False)
    borehole_id = sql.Column(sql.Integer(),
        sql.ForeignKey('borehole.id'), nullable=False)
    depth_from = sql.Column(sql.Float(), nullable=False)
    depth_to = sql.Column(sql.Float(), nullable=False)
    comments = sql.Column(sql.String(512))


class CorePhotoSchema(ma.SQLAlchemyAutoSchema):
    Meta = schema_metadata(CorePhoto)


class Borehole(sql.Model):
    __tablename__ = 'borehole'

    id = sql.Column(sql.Integer(), primary_key=True)
    name = sql.Column(sql.String(64), nullable=False)
    easting = sql.Column(sql.Float(), nullable=False)
    northing = sql.Column(sql.Float(), nullable=False)
    elevation = sql.Column(sql.Float(), nullable=False)

    surveys = sql.relationship(
        Survey,
        backref='borehole',
        cascade='all, delete, delete-orphan',
        single_parent=True,
    )

    core_photos = sql.relationship(
        CorePhoto,
        backref='borehole',
        cascade='all, delete, delete-orphan',
        single_parent=True,
    )

    cropped_core_photos = sql.relationship(
        CroppedCorePhoto,
        backref='borehole',
        cascade='all, delete, delete-orphan',
        single_parent=True,
    )


class BoreholeSchema(ma.SQLAlchemyAutoSchema):
    Meta = schema_metadata(Borehole)
    #borehole_id = ma.auto_field('id')
