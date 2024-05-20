from marshmallow import (
    Schema,
    fields
)


class TextClassifierSchema(Schema):
    label = fields.Str()
    score = fields.Float()
    