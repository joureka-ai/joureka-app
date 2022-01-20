from app.schemas import TranscriptionResults, Results, Item, Alternative, Transcript
from typing import Any

def create_transcript_obj(jobName: str, part_trans: str, item: Item) -> TranscriptionResults: 
    return TranscriptionResults(
        jobName=jobName,
        results=Results(
            transcripts=[Transcript(
                transcript=f"{part_trans} ")],
            speaker_labels=None,
            items=[item],
        ),
        status="started"
    )

def extend_transcript_obj(transcript: TranscriptionResults, part_trans: str, item: Item) -> TranscriptionResults:
    transcript.results.transcripts[-1].transcript += f"{part_trans} "
    transcript.results.items.append(item)

def create_item(raw_item: Any) -> Item:
    alternative = Alternative(confidence=raw_item.conf, content=raw_item.word)
    return Item(
            start_time=raw_item.start,
            end_time=raw_item.end,
            alternatives=[alternative]
        )