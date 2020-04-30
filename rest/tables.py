from sqlalchemy.dialects import postgresql
from sqlalchemy.schema import CreateTable
from sqlalchemy.orm import mapper

from config import sql, ma


def schema_metadata(cls):
    class Meta:
        model = cls
        load_instance=True
        sqla_session = sql.session
        include_fk = True
        include_relationships = True
    return Meta


class Table:
    def __new__(cls, *args, **kwargs):
        class Schema:
            Meta = schema_metadata(cls)
        cls.__marshmallow__ = Schema


class Borehole(Table, sql.Model):
    borehole_id = sql.Column(sql.Integer(), primary_key=True)
    name = sql.Column(sql.String(64), nullable=False)
    easting = sql.Column(sql.Float(), nullable=False)
    northing = sql.Column(sql.Float(), nullable=False)
    elevation = sql.Column(sql.Float(), nullable=False)


class Survey(sql.Model):
    survey_id = sql.Column(sql.Integer(), primary_key=True)
    borehole_id = sql.Column(
            sql.Integer(), sql.ForeignKey(Borehole.borehole_id))
    depth = sql.Column(sql.Float(), nullable=False)
    survey_id = sql.Column(sql.Integer(), primary_key=True, nullable=False)
    azimuth = sql.Column(sql.Float(), nullable=False)
    dip = sql.Column(sql.Float(), nullable=False)


class CorePhotoCorner(sql.Model):
    __tablename__ = 'corephotocorner'
    corner_id = sql.Column(sql.Integer, primary_key=True)
    top = sql.Column(sql.Float(), nullable=False)
    left = sql.Column(sql.Float(), nullable=False)


class CorePhotoLog(sql.Model):
    hash = sql.Column(sql.Integer, primary_key=True)
    borehole_id = sql.Column(sql.Integer(),
        sql.ForeignKey(Borehole.borehole_id), nullable=False)
    depth_from = sql.Column(sql.Float(), primary_key=True)
    depth_to = sql.Column(sql.Float(), nullable=False)
    path = sql.Column(sql.String(1024), nullable=False)
    crop_corner_1 = sql.Column(
        sql.Integer(), sql.ForeignKey(CorePhotoCorner.corner_id),
        nullable=False)
    crop_corner_2 = sql.Column(
        sql.Integer(), sql.ForeignKey(CorePhotoCorner.corner_id),
        nullable=False)
    crop_corner_3 = sql.Column(
        sql.Integer(), sql.ForeignKey(CorePhotoCorner.corner_id),
        nullable=False)
    crop_corner_4 = sql.Column(
        sql.Integer(), sql.ForeignKey(CorePhotoCorner.corner_id),
        nullable=False)
    comments = sql.Column(sql.String(1024))
