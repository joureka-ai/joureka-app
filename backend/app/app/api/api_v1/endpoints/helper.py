from typing import Any, Optional, List
import logging

LOG = logging.getLogger(__name__)

from app.models.annot import Annot
from app.schemas import PinFrequencies, PinFreq, WordFrequencies, WordFreq

def check_doc_in_docs(doc_ids: List[int], annot_doc_id: int) -> bool:
    LOG.info(annot_doc_id)
    return annot_doc_id in doc_ids


def calcuate_frequencies(annots: List[Annot]) -> PinFrequencies:
    freq_dict = {}
    
    for annot in annots:
        if not annot.label in freq_dict.keys():
            freq_dict[annot.label] = {}

        freq = freq_dict[annot.label].get("frequency", 0)
        freq_dict[annot.label]["frequency"] = freq + 1
        
        if not "recordings" in freq_dict[annot.label].keys():
            freq_dict[annot.label]["recordings"] = []

        if not annot.id in freq_dict[annot.label]["recordings"]:
            freq_dict[annot.label]["recordings"].append(annot.id)

    pin_freqs = []
    for key in freq_dict:
        pin_freq = PinFreq(name=key,
                        frequency=freq_dict[key]["frequency"],
                        recordings=freq_dict[key]["recordings"])
        pin_freqs.append(pin_freq)

    return PinFrequencies(pins=pin_freqs)

def transform_word_freqs(freq_list: List) -> WordFrequencies:

    word_freqs = []
    for freq in freq_list:
        word_freq = WordFreq(word=freq["word"],
                        frequency=freq["frequency"],
                        recordings=freq["doc_id"])
        word_freqs.append(word_freq)

    return WordFrequencies(words=word_freqs)
