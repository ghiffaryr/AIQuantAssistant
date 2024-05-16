
# Speech Recognition  
Speech Recognition project using OpenAI Whisper


## System Information

**OS:** Ubuntu 22.04 (Docker)

**Python:** Tested on Python 3.10


## Modules Used  
- **Python** (downloaded from pip)
    1. whisperx (https://github.com/m-bain/whisperx)
    2. responder
    3. marshmallow
    4. loguru
    5. uvicorn
    6. pyyaml
    7. pathlib
- **Ubuntu** (downloaded from apt)
    1. python3.10
    2. python3.10-dev
    3. python3-pip
    4. ffmpeg
    5. pipenv


## Build and Deploy  

**Prerequisites**
- Please make sure [WSL](https://learn.microsoft.com/en-us/windows/wsl/install#install-wsl-command) and [Docker Desktop](https://docs.docker.com/desktop/install/windows-install/) already installed before run steps below.
- Please make sure your SSH for your GitHub account is ready to be used, please refer to [this link](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account?platform=linux) for how to setup the SSH.

### Steps

1. **Update and upgrade repository**
```
sudo apt-get update && apt-get upgrade
```

2. **Install Docker Compose and Docker in WSL** (ignore if Docker already installed/configured before)
```
sudo apt-get install docker docker-compose
```

3. **Clone the project**  
```
  git clone git@github.com:cac-empath/SpeechRecognition.git
```

4. **Go to the project directory**  
```
  cd SpeechRecognition
```

5. **Build and deploy the instance**

```
docker-compose -f docker-compose.yml up
```

6. **Test the instance**

You could test the instance at the Docker using apps like [Postman](https://learning.postman.com/docs/getting-started/sending-the-first-request/) to make the API request.
## Endpoints

If you deploy the instance locally, the base URL for the API request should be http://localhost:8000/

1. **/api/v1/docs**

Full URL : http://localhost:8000/api/v1/docs

HTTP Method : **GET**

Request Body : -

Description : API documentation.


2. **/api/v1/status**

Full URL : http://localhost:8000/api/v1/status

HTTP Method : **GET**

Request Body : -

Description : To test if the instance is up or not.

Example Result :
```
{
    "status": "ok"
}
```

3. **/api/v1/languages**

Full URL : http://localhost:8000/api/v1/languages

HTTP Method : **GET**

Request Body : -

Description : Show supported languages by OpenAI Whisper transcription library.

Example Result :
```
{
    "status": "ok",
    "result": {
        "en": "english",
        "zh": "chinese",
        "de": "german",
        "es": "spanish",
        "ru": "russian",
        "ko": "korean",
        "fr": "french",
        "ja": "japanese",
        "pt": "portuguese",
        "tr": "turkish",
        "pl": "polish",
        "ca": "catalan",
        "nl": "dutch",
        "ar": "arabic",
        "sv": "swedish",
        "it": "italian",
        "id": "indonesian",
        "hi": "hindi",
        "fi": "finnish",
        "vi": "vietnamese",
        "he": "hebrew",
        "uk": "ukrainian",
        "el": "greek",
        "ms": "malay",
        "cs": "czech",
        "ro": "romanian",
        "da": "danish",
        "hu": "hungarian",
        "ta": "tamil",
        "no": "norwegian",
        "th": "thai",
        "ur": "urdu",
        "hr": "croatian",
        "bg": "bulgarian",
        "lt": "lithuanian",
        "la": "latin",
        "mi": "maori",
        "ml": "malayalam",
        "cy": "welsh",
        "sk": "slovak",
        "te": "telugu",
        "fa": "persian",
        "lv": "latvian",
        "bn": "bengali",
        "sr": "serbian",
        "az": "azerbaijani",
        "sl": "slovenian",
        "kn": "kannada",
        "et": "estonian",
        "mk": "macedonian",
        "br": "breton",
        "eu": "basque",
        "is": "icelandic",
        "hy": "armenian",
        "ne": "nepali",
        "mn": "mongolian",
        "bs": "bosnian",
        "kk": "kazakh",
        "sq": "albanian",
        "sw": "swahili",
        "gl": "galician",
        "mr": "marathi",
        "pa": "punjabi",
        "si": "sinhala",
        "km": "khmer",
        "sn": "shona",
        "yo": "yoruba",
        "so": "somali",
        "af": "afrikaans",
        "oc": "occitan",
        "ka": "georgian",
        "be": "belarusian",
        "tg": "tajik",
        "sd": "sindhi",
        "gu": "gujarati",
        "am": "amharic",
        "yi": "yiddish",
        "lo": "lao",
        "uz": "uzbek",
        "fo": "faroese",
        "ht": "haitian creole",
        "ps": "pashto",
        "tk": "turkmen",
        "nn": "nynorsk",
        "mt": "maltese",
        "sa": "sanskrit",
        "lb": "luxembourgish",
        "my": "myanmar",
        "bo": "tibetan",
        "tl": "tagalog",
        "mg": "malagasy",
        "as": "assamese",
        "tt": "tatar",
        "haw": "hawaiian",
        "ln": "lingala",
        "ha": "hausa",
        "ba": "bashkir",
        "jw": "javanese",
        "su": "sundanese"
    }
}
```

4. **/api/v1/models**

Full URL : http://localhost:8000/api/v1/models

HTTP Method : **GET**

Request Body : -

Description : Show supported models by OpenAI Whisper transcription library.

Example Result :
```
{
    "status": "ok",
    "result": {
        "tiny": "Tiny",
        "base": "Base",
        "small": "Small",
        "medium": "Medium",
        "large-v1": "Large",
        "large-v2": "Large v2"
    }
}
```

5. **/api/v1/vad_asr_transcribe**

Full URL : http://localhost:8000/api/v1/vad_asr_transcribe

HTTP Method : **POST**

Request Body : **Form Data**

Form Data Params. : 
- **file** : Audio file to be transcribed.
- **model_name** : Model to be used for inference.
- **language** : Language code to be used in the transcription, let the values blank if you want to use auto. language from OpenAI Whisper library. For the available language code, you could list it using the languages endpoint.
- **asr_options** : Automatic Speech Recognition options, includes beam_size (default 5), patience (default null), length_penalty (default 1.0), temperatures (default 0), compression_ratio_threshold (default 2.4), log_prob_threshold (default -1.0), no_speech_threshold (default 0.6), condition_on_previous_text (default False), initial_prompt (default null), suppress_tokens (default '-1'), suppress_numerals (default False).
- **vad_options** : Voice Activity Detection options, includes vad_onset (default 0.500) and vad_offset (default 0.363).
- **task** : Task to do, options are "transcribe" or "translate".
- **batch_size** : Batch size (default 8).
- **chunk_size** : Chunk size (default 30).


Description : Transcribe audio into text using OpenAI Whisper.

Example Result :
```
{
    "status": "ok",
    "result": {
        "segments": [
            {
                "text": " I'm Richard Dawkins. My life has been at the University of Oxford. I'm an evolutionary biologist. I've written about 12 books. Most of them about evolution, one where another. One children's book about science and one atheism book. It's a God delusion.",
                "start": "00:00:00.009000",
                "end": "00:00:15.316000"
            }
        ],
        "language": "en"
    }
}
```

6. **/api/v1/align_transcribe**

Full URL : http://localhost:8000/api/v1/align_transcribe

HTTP Method : **POST**

Request Body : **Form Data**

Form Data Params. : 
- **file** : Audio file to be transcribed.
- **model_name** : Model to be used for inference.
- **language** : Language code to be used in the transcription, let the values blank if you want to use auto. language from OpenAI Whisper library. For the available language code, you could list it using the languages endpoint.
- **asr_options** : Automatic Speech Recognition options, includes beam_size (default 5), patience (default null), length_penalty (default 1.0), temperatures (default 0), compression_ratio_threshold (default 2.4), log_prob_threshold (default -1.0), no_speech_threshold (default 0.6), condition_on_previous_text (default False), initial_prompt (default null), suppress_tokens (default '-1'), suppress_numerals (default False).
- **vad_options** : Voice Activity Detection options, includes vad_onset (default 0.500) and vad_offset (default 0.363).
- **task** : Task to do, options are "transcribe" and "translate".
- **language_code** : Language code for translation result (default "en").
- **align_model** : Align model (default null). Option for each language code, 
```
{
    "en": "WAV2VEC2_ASR_BASE_960H",
    "fr": "VOXPOPULI_ASR_BASE_10K_FR",
    "de": "VOXPOPULI_ASR_BASE_10K_DE",
    "es": "VOXPOPULI_ASR_BASE_10K_ES",
    "it": "VOXPOPULI_ASR_BASE_10K_IT",
    "ja": "jonatasgrosman/wav2vec2-large-xlsr-53-japanese",
    "zh": "jonatasgrosman/wav2vec2-large-xlsr-53-chinese-zh-cn",
    "nl": "jonatasgrosman/wav2vec2-large-xlsr-53-dutch",
    "uk": "Yehor/wav2vec2-xls-r-300m-uk-with-small-lm",
    "pt": "jonatasgrosman/wav2vec2-large-xlsr-53-portuguese",
    "ar": "jonatasgrosman/wav2vec2-large-xlsr-53-arabic",
    "cs": "comodoro/wav2vec2-xls-r-300m-cs-250",
    "ru": "jonatasgrosman/wav2vec2-large-xlsr-53-russian",
    "pl": "jonatasgrosman/wav2vec2-large-xlsr-53-polish",
    "hu": "jonatasgrosman/wav2vec2-large-xlsr-53-hungarian",
    "fi": "jonatasgrosman/wav2vec2-large-xlsr-53-finnish",
    "fa": "jonatasgrosman/wav2vec2-large-xlsr-53-persian",
    "el": "jonatasgrosman/wav2vec2-large-xlsr-53-greek",
    "tr": "mpoyraz/wav2vec2-xls-r-300m-cv7-turkish",
    "da": "saattrupdan/wav2vec2-xls-r-300m-ftspeech",
    "he": "imvladikon/wav2vec2-xls-r-300m-hebrew",
    "vi": 'nguyenvulebinh/wav2vec2-base-vi',
    "ko": "kresnik/wav2vec2-large-xlsr-korean",
    "ur": "kingabzpro/wav2vec2-large-xls-r-300m-Urdu",
    "te": "anuragshas/wav2vec2-large-xlsr-53-telugu",
    "hi": "theainerd/Wav2Vec2-large-xlsr-hindi"
}
```
- **interpolate_method** : Chunk size (default "nearest"), options are "nearest", "linear", and "ignore".
- **return_char_alignments** : Return char alignments (default False).


Description : Transcribe and align audio chunks into text using OpenAI Whisper.

Example Result :
```
{
    "status": "ok",
    "result": {
        "segments": [
            {
                "text": " I'm Richard Dawkins.",
                "start": "00:00:00.109000",
                "end": "00:00:01.150000",
                "words": [
                    {
                        "word": "I'm",
                        "start": "00:00:00.109000",
                        "end": "00:00:00.249000",
                        "score": 0.68
                    },
                    {
                        "word": "Richard",
                        "start": "00:00:00.309000",
                        "end": "00:00:00.549000",
                        "score": 0.945
                    },
                    {
                        "word": "Dawkins.",
                        "start": "00:00:00.589000",
                        "end": "00:00:01.089000",
                        "score": 0.704
                    }
                ]
            },
            {
                "text": "My life has been at the University of Oxford.",
                "start": "00:00:01.150000",
                "end": "00:00:04.291000",
                "words": [
                    {
                        "word": "My",
                        "start": "00:00:01.150000",
                        "end": "00:00:01.270000",
                        "score": 0.922
                    },
                    {
                        "word": "life",
                        "start": "00:00:01.330000",
                        "end": "00:00:01.530000",
                        "score": 0.752
                    },
                    {
                        "word": "has",
                        "start": "00:00:01.550000",
                        "end": "00:00:01.690000",
                        "score": 0.912
                    },
                    {
                        "word": "been",
                        "start": "00:00:01.730000",
                        "end": "00:00:01.970000",
                        "score": 0.758
                    },
                    {
                        "word": "at",
                        "start": "00:00:02.170000",
                        "end": "00:00:02.250000",
                        "score": 0.766
                    },
                    {
                        "word": "the",
                        "start": "00:00:02.290000",
                        "end": "00:00:02.370000",
                        "score": 0.93
                    },
                    {
                        "word": "University",
                        "start": "00:00:02.430000",
                        "end": "00:00:02.970000",
                        "score": 0.931
                    },
                    {
                        "word": "of",
                        "start": "00:00:03.010000",
                        "end": "00:00:03.070000",
                        "score": 0.75
                    },
                    {
                        "word": "Oxford.",
                        "start": "00:00:03.170000",
                        "end": "00:00:03.611000",
                        "score": 0.815
                    }
                ]
            },
            {
                "text": "I'm an evolutionary biologist.",
                "start": "00:00:04.291000",
                "end": "00:00:05.852000",
                "words": [
                    {
                        "word": "I'm",
                        "start": "00:00:04.291000",
                        "end": "00:00:04.411000",
                        "score": 0.666
                    },
                    {
                        "word": "an",
                        "start": "00:00:04.451000",
                        "end": "00:00:04.531000",
                        "score": 0.882
                    },
                    {
                        "word": "evolutionary",
                        "start": "00:00:04.571000",
                        "end": "00:00:05.111000",
                        "score": 0.865
                    },
                    {
                        "word": "biologist.",
                        "start": "00:00:05.151000",
                        "end": "00:00:05.792000",
                        "score": 0.912
                    }
                ]
            },
            {
                "text": "I've written about 12 books.",
                "start": "00:00:05.852000",
                "end": "00:00:07.312000",
                "words": [
                    {
                        "word": "I've",
                        "start": "00:00:05.852000",
                        "end": "00:00:06.012000",
                        "score": 0.818
                    },
                    {
                        "word": "written",
                        "start": "00:00:06.032000",
                        "end": "00:00:06.312000",
                        "score": 0.824
                    },
                    {
                        "word": "about",
                        "start": "00:00:06.392000",
                        "end": "00:00:06.592000",
                        "score": 0.952
                    },
                    {
                        "word": "12"
                    },
                    {
                        "word": "books.",
                        "start": "00:00:06.932000",
                        "end": "00:00:07.232000",
                        "score": 0.754
                    }
                ]
            },
            {
                "text": "Most of them about evolution, one where another.",
                "start": "00:00:07.312000",
                "end": "00:00:09.934000",
                "words": [
                    {
                        "word": "Most",
                        "start": "00:00:07.312000",
                        "end": "00:00:07.492000",
                        "score": 0.648
                    },
                    {
                        "word": "of",
                        "start": "00:00:07.532000",
                        "end": "00:00:07.592000",
                        "score": 0.758
                    },
                    {
                        "word": "them",
                        "start": "00:00:07.632000",
                        "end": "00:00:07.753000",
                        "score": 0.894
                    },
                    {
                        "word": "about",
                        "start": "00:00:07.833000",
                        "end": "00:00:08.093000",
                        "score": 0.835
                    },
                    {
                        "word": "evolution,",
                        "start": "00:00:08.213000",
                        "end": "00:00:08.673000",
                        "score": 0.84
                    },
                    {
                        "word": "one",
                        "start": "00:00:08.753000",
                        "end": "00:00:08.833000",
                        "score": 0.861
                    },
                    {
                        "word": "where",
                        "start": "00:00:08.853000",
                        "end": "00:00:09.033000",
                        "score": 0.468
                    },
                    {
                        "word": "another.",
                        "start": "00:00:09.073000",
                        "end": "00:00:09.373000",
                        "score": 0.752
                    }
                ]
            },
            {
                "text": "One children's book about science and one atheism book.",
                "start": "00:00:09.934000",
                "end": "00:00:13.815000",
                "words": [
                    {
                        "word": "One",
                        "start": "00:00:09.934000",
                        "end": "00:00:10.054000",
                        "score": 0.753
                    },
                    {
                        "word": "children's",
                        "start": "00:00:10.114000",
                        "end": "00:00:10.594000",
                        "score": 0.796
                    },
                    {
                        "word": "book",
                        "start": "00:00:10.654000",
                        "end": "00:00:10.894000",
                        "score": 0.886
                    },
                    {
                        "word": "about",
                        "start": "00:00:11.434000",
                        "end": "00:00:11.674000",
                        "score": 0.883
                    },
                    {
                        "word": "science",
                        "start": "00:00:11.734000",
                        "end": "00:00:12.175000",
                        "score": 0.782
                    },
                    {
                        "word": "and",
                        "start": "00:00:12.515000",
                        "end": "00:00:12.635000",
                        "score": 0.858
                    },
                    {
                        "word": "one",
                        "start": "00:00:12.775000",
                        "end": "00:00:12.935000",
                        "score": 0.853
                    },
                    {
                        "word": "atheism",
                        "start": "00:00:13.095000",
                        "end": "00:00:13.575000",
                        "score": 0.923
                    },
                    {
                        "word": "book.",
                        "start": "00:00:13.615000",
                        "end": "00:00:13.795000",
                        "score": 0.872
                    }
                ]
            },
            {
                "text": "It's a God delusion.",
                "start": "00:00:13.815000",
                "end": "00:00:15.196000",
                "words": [
                    {
                        "word": "It's",
                        "start": "00:00:13.815000",
                        "end": "00:00:14.476000",
                        "score": 0.417
                    },
                    {
                        "word": "a",
                        "start": "00:00:14.516000",
                        "end": "00:00:14.556000",
                        "score": 0.696
                    },
                    {
                        "word": "God",
                        "start": "00:00:14.576000",
                        "end": "00:00:14.796000",
                        "score": 0.852
                    },
                    {
                        "word": "delusion.",
                        "start": "00:00:14.816000",
                        "end": "00:00:15.196000",
                        "score": 0.982
                    }
                ]
            }
        ],
        "word_segments": [
            {
                "word": "I'm",
                "start": "00:00:00.109000",
                "end": "00:00:00.249000",
                "score": 0.68
            },
            {
                "word": "Richard",
                "start": "00:00:00.309000",
                "end": "00:00:00.549000",
                "score": 0.945
            },
            {
                "word": "Dawkins.",
                "start": "00:00:00.589000",
                "end": "00:00:01.089000",
                "score": 0.704
            },
            {
                "word": "My",
                "start": "00:00:01.150000",
                "end": "00:00:01.270000",
                "score": 0.922
            },
            {
                "word": "life",
                "start": "00:00:01.330000",
                "end": "00:00:01.530000",
                "score": 0.752
            },
            {
                "word": "has",
                "start": "00:00:01.550000",
                "end": "00:00:01.690000",
                "score": 0.912
            },
            {
                "word": "been",
                "start": "00:00:01.730000",
                "end": "00:00:01.970000",
                "score": 0.758
            },
            {
                "word": "at",
                "start": "00:00:02.170000",
                "end": "00:00:02.250000",
                "score": 0.766
            },
            {
                "word": "the",
                "start": "00:00:02.290000",
                "end": "00:00:02.370000",
                "score": 0.93
            },
            {
                "word": "University",
                "start": "00:00:02.430000",
                "end": "00:00:02.970000",
                "score": 0.931
            },
            {
                "word": "of",
                "start": "00:00:03.010000",
                "end": "00:00:03.070000",
                "score": 0.75
            },
            {
                "word": "Oxford.",
                "start": "00:00:03.170000",
                "end": "00:00:03.611000",
                "score": 0.815
            },
            {
                "word": "I'm",
                "start": "00:00:04.291000",
                "end": "00:00:04.411000",
                "score": 0.666
            },
            {
                "word": "an",
                "start": "00:00:04.451000",
                "end": "00:00:04.531000",
                "score": 0.882
            },
            {
                "word": "evolutionary",
                "start": "00:00:04.571000",
                "end": "00:00:05.111000",
                "score": 0.865
            },
            {
                "word": "biologist.",
                "start": "00:00:05.151000",
                "end": "00:00:05.792000",
                "score": 0.912
            },
            {
                "word": "I've",
                "start": "00:00:05.852000",
                "end": "00:00:06.012000",
                "score": 0.818
            },
            {
                "word": "written",
                "start": "00:00:06.032000",
                "end": "00:00:06.312000",
                "score": 0.824
            },
            {
                "word": "about",
                "start": "00:00:06.392000",
                "end": "00:00:06.592000",
                "score": 0.952
            },
            {
                "word": "12"
            },
            {
                "word": "books.",
                "start": "00:00:06.932000",
                "end": "00:00:07.232000",
                "score": 0.754
            },
            {
                "word": "Most",
                "start": "00:00:07.312000",
                "end": "00:00:07.492000",
                "score": 0.648
            },
            {
                "word": "of",
                "start": "00:00:07.532000",
                "end": "00:00:07.592000",
                "score": 0.758
            },
            {
                "word": "them",
                "start": "00:00:07.632000",
                "end": "00:00:07.753000",
                "score": 0.894
            },
            {
                "word": "about",
                "start": "00:00:07.833000",
                "end": "00:00:08.093000",
                "score": 0.835
            },
            {
                "word": "evolution,",
                "start": "00:00:08.213000",
                "end": "00:00:08.673000",
                "score": 0.84
            },
            {
                "word": "one",
                "start": "00:00:08.753000",
                "end": "00:00:08.833000",
                "score": 0.861
            },
            {
                "word": "where",
                "start": "00:00:08.853000",
                "end": "00:00:09.033000",
                "score": 0.468
            },
            {
                "word": "another.",
                "start": "00:00:09.073000",
                "end": "00:00:09.373000",
                "score": 0.752
            },
            {
                "word": "One",
                "start": "00:00:09.934000",
                "end": "00:00:10.054000",
                "score": 0.753
            },
            {
                "word": "children's",
                "start": "00:00:10.114000",
                "end": "00:00:10.594000",
                "score": 0.796
            },
            {
                "word": "book",
                "start": "00:00:10.654000",
                "end": "00:00:10.894000",
                "score": 0.886
            },
            {
                "word": "about",
                "start": "00:00:11.434000",
                "end": "00:00:11.674000",
                "score": 0.883
            },
            {
                "word": "science",
                "start": "00:00:11.734000",
                "end": "00:00:12.175000",
                "score": 0.782
            },
            {
                "word": "and",
                "start": "00:00:12.515000",
                "end": "00:00:12.635000",
                "score": 0.858
            },
            {
                "word": "one",
                "start": "00:00:12.775000",
                "end": "00:00:12.935000",
                "score": 0.853
            },
            {
                "word": "atheism",
                "start": "00:00:13.095000",
                "end": "00:00:13.575000",
                "score": 0.923
            },
            {
                "word": "book.",
                "start": "00:00:13.615000",
                "end": "00:00:13.795000",
                "score": 0.872
            },
            {
                "word": "It's",
                "start": "00:00:13.815000",
                "end": "00:00:14.476000",
                "score": 0.417
            },
            {
                "word": "a",
                "start": "00:00:14.516000",
                "end": "00:00:14.556000",
                "score": 0.696
            },
            {
                "word": "God",
                "start": "00:00:14.576000",
                "end": "00:00:14.796000",
                "score": 0.852
            },
            {
                "word": "delusion.",
                "start": "00:00:14.816000",
                "end": "00:00:15.196000",
                "score": 0.982
            }
        ]
    }
}
```