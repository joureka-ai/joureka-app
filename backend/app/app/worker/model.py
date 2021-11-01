import logging
from asrecognition import ASREngine
from app.file_storage.file import get_file_for_key
from app.core.config import settings

import librosa
import numpy 
import json
import math
import pandas as pd
from app.schemas import TranscriptionResults, Results
from .helper import create_item, create_transcript_obj, extend_transcript_obj

from vosk import Model, KaldiRecognizer, SetLogLevel

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
        assert audio_file

        audio_paths = [str(audio_file.path)]
        return self.model.transcribe(audio_paths)

class VoskEngine:
    """ Wrapper for loading and serving trained Vosk model"""

    def __init__(self):
        SetLogLevel(0)
        model = Model(f"{settings.ASR_MODEL_DIR}vosk/vosk-model-small-de-0.15")
        self.recognizer = KaldiRecognizer(model, settings.AUDIO_SAMPLE_RATE)
        self.recognizer.SetWords(True)

    @staticmethod
    def _load_model():
        SetLogLevel(0)
        model = Model(f"{settings.ASR_MODEL_DIR}vosk/vosk-model-small-de-0.15")
        recognizer = KaldiRecognizer(model, settings.AUDIO_SAMPLE_RATE)
        recognizer.SetWords(True)
        return recognizer

    def _extract_words(self, res):
        """
        
        Source: https://stackoverflow.com/questions/64153590/audio-signal-split-at-word-level-boundary
        """

        jres = json.loads(res)
        if not 'result' in jres:
            return []
        words = jres['result']
        return words

    def _transform_to_trans_obj(self, results: pd.DataFrame, jobName: str) -> TranscriptionResults:
        transcript = None

        for row in results.itertuples():
            if not transcript:
                item = create_item(row)
                transcript = create_transcript_obj(
                    jobName=jobName,
                    part_trans=row.word,
                    item=item
                )
            else:
                item = create_item(row)
                extend_transcript_obj(transcript, row.word, item)

        transcript.status = "finished"
        
        return transcript

    def load_audio(self, filekey) -> bytes:
        """
        Source: https://stackoverflow.com/questions/64153590/audio-signal-split-at-word-level-boundary
        """
        audio_file = get_file_for_key(filekey)
        assert audio_file

        audio, sr = librosa.load(str(audio_file.path), sr=settings.AUDIO_SAMPLE_RATE)
        # convert to 16bit signed PCM, as expected by VOSK
        return numpy.int16(audio * 32768).tobytes() 

    def transcribe(self, bytes: bytes, jobName: str):
        """
        Predict on a single audio file.
        Source: https://stackoverflow.com/questions/64153590/audio-signal-split-at-word-level-boundary
        """
        results = []

        chunk_size = 4000
        for chunk_no in range(math.ceil(len(bytes)/chunk_size)):
            start = chunk_no*chunk_size
            end = min(len(bytes), (chunk_no+1)*chunk_size)
            data = bytes[start:end]

            if self.recognizer.AcceptWaveform(data):
                words = self._extract_words(self.recognizer.Result())
                results += words
        results += self._extract_words(self.recognizer.FinalResult())
        df = pd.DataFrame.from_records(results)
        df = df.sort_values("start")

        transcription = self._transform_to_trans_obj(df, jobName)
        
        return transcription.dict()