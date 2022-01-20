from enum import Enum

class Engines(str, Enum):
    """Enum for the ASR models we support"""

    wav2vec2 = "wav2vec2"
    vosk = "vosk"