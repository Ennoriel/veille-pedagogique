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

1. Run with the virtual env the main.py script

***Note:*** in order to solve PyCharm not to recognize source imports, define the src directory as the source root (right click on src directory > Mark directory as > Sources root)