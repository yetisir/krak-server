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
    core_photo_id = sql.Column(sql.Integer, sql.ForeignKey('core_photo_log.id'))
    top = sql.Column(sql.Float(), nullable=False)
    left = sql.Column(sql.Float(), nullable=False)


class CorePhotoCornerSchema(ma.SQLAlchemyAutoSchema):
    Meta = schema_metadata(CorePhotoCorner)


class CorePhotoLog(sql.Model):
    __tablename__ = 'core_photo_log'

    id = sql.Column(sql.Integer(), primary_key=True)
    hash = sql.Column(sql.Integer)
    borehole_id = sql.Column(sql.Integer(),
        sql.ForeignKey('borehole.id'), nullable=False)
    depth_from = sql.Column(sql.Float(), nullable=False)
    depth_to = sql.Column(sql.Float(), nullable=False)
    path = sql.Column(sql.String(1024), nullable=False)
    comments = sql.Column(sql.String(1024))

    core_photo_corners = sql.relationship(
        CorePhotoCorner,
        backref='core_photo',
        cascade='all, delete, delete-orphan',
        single_parent=True,
    )


class CorePhotoLogSchema(ma.SQLAlchemyAutoSchema):
    Meta = schema_metadata(CorePhotoLog)


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

    core_photo_logs = sql.relationship(
        CorePhotoLog,
        backref='borehole',
        cascade='all, delete, delete-orphan',
        single_parent=True,
    )


class BoreholeSchema(ma.SQLAlchemyAutoSchema):
    Meta = schema_metadata(Borehole)
    #borehole_id = ma.auto_field('id')
