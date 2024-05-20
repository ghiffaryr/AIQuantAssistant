from marshmallow import (
    Schema,
    fields
)


class DictionarySchema(Schema):
    code = fields.Str()
    name = fields.Str()
    