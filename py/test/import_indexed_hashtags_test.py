import unittest
from import_indexed_hashtags import make_mongo_url, connect_mong_client


class ImportIndexedHashtagsTest(unittest.TestCase):

    def test_make_mongo_url(self):
        """
        Test that the method make_mongo_url is correct
        """
        self.assertEqual(
            make_mongo_url("user", "pwd", "url", "db"),
            "mongodb://user:pwd@url/db"
        )

    def test_connect_mong_client(self):
        """
        Test that the method connect_mong_client is correct
        """
        with self.subTest(i=1):
            with self.assertRaises(Exception):
                connect_mong_client("user", "pwd", "url")

        with self.subTest(i=2):
            self.assertIsNotNone(connect_mong_client(make_mongo_url("user", "pwd", "url", "db"), "db"))

        with self.subTest(i=3):
            self.assertIsNotNone(connect_mong_client("user", "pwd", "url", "db"))