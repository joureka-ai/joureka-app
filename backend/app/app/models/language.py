import enum

from spacy.lang.de import German

class Language(enum.Enum):
    """Enum for the languages we support"""

    de_DE = "de-DE"
    en_GB = "en-GB"
    en_US = "en-US"
    es_ES = "es-ES"


ger_nlp = German()
ger_tokenizer = ger_nlp.tokenizer

language_to_tokenizer = {
    "de-DE": ger_tokenizer,
}