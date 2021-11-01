from sqlalchemy_utils import force_auto_coercion

# setup auto coercion. This does type checking and value conversion at
# assignment time and not only when entering the database.
# https://sqlalchemy-utils.readthedocs.io/en/latest/listeners.html#sqlalchemy_utils.listeners.force_auto_coercion
force_auto_coercion()

from .user import User
from .document import Document
from .word import Word
from .project import Project
from .annot import Annot
from .transcript import Transcription
from .engines import Engines