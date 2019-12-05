# How to make it work

1. checkout sources

    ``` Git
    git clone git@framagit.org:Maxime103/veille-pedago.git
    ```

1. import sources in PyCharm
1. create virtual env (eventually) either with PyCharm (Setting > Project > Project Interpreter > Show All... > new) or with the following commands:

    ``` Python
    python3 -m venv env
    source env/bin/activate
    ```

1. install dependencies:

    ``` Python
    pip install -r requirements.txt
    ```

1. Install nltk punkt dictionnary [help](https://www.nltk.org/data.html)

    ``` Python
    import nltk
    nltk.download()
    ```

Download the punkt dictionnary.

1. Run with the virtual env the main.py script

***Note:*** in order to solve PyCharm not to recognize source imports, define the src directory as the source root (right click on src directory > Mark directory as > Sources root)

# 4 main jobs

## import tweets from local tweet ids

In main.py script:

    self.api_custo.fetch_and_parse(fetch_local=True)

A text file called tweet_id.txt is required in the resources dir.

Example file :

    [1037648412617990146, 1037649354750914561]

The script extract_tweet_id_from_ifttt_export.py can be used to create such a file. This script should be modified wtith IFTTT file names.

## import tweets from hashtag

in main.py script:

    self.api_custo.fetch_and_parse(fetch_local=False)

## dump database

in script import_indexed_hashtags.py:

    dump_db()

The script should be modified with input and output databases.

## batch import theme synonyms

in script import_indexed_hashtags.py:

    import_indexed_hashtags()

A csv file called tweet_id.txt is required in the resources dir.

Example file :

    entry;nombre d'occurrence;associatedThemes;themeToBeDeleted;articleToBeDeleted
    Pédagogie;1526;Pédagogie;;
    Education;373;Education;;
    MedEd;52;;True;
    PrélèvementALaSource;9;;;True
