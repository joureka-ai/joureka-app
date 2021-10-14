import logging
from asrecognition import ASREngine
from app.file_storage.file import get_file_for_key

LOG = logging.getLogger(__name__)

class Wav2Vec2Engine:
    """ Wrapper for loading and serving trained Wav2Vec2 model"""

    def __init__(self):
        self.model = ASREngine("de", model_path="jonatasgrosman/wav2vec2-large-xlsr-53-german")

    @staticmethod
    def _load_model():
        model = ASREngine("de", model_path="jonatasgrosman/wav2vec2-large-xlsr-53-german")
        return model

    def transcribe(self, audio_path):
        """
        Predict on a single audio file.
        """
        audio_file = get_file_for_key(audio_path)
        #ASREngine.transcribe
        assert audio_file

        audio_paths = [str(audio_file.path)]
        return self.model.transcribe(audio_paths)
