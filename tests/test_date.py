import unittest
import datetime

from snl.fetch.helpers.date import parse_date


class ParseDateTestCase(unittest.TestCase):

    def test_correctly_formatted(self):
        good_dates = [
            "January 17, 1940",
            "October 01, 1990",
            "November 2, 1978"
        ]
        for gd in good_dates:
            date = parse_date(gd)
            self.assertIsInstance(date, datetime.date)

    def test_incorrectly_formatted(self):
        bad_dates = [
            None,
            "January 17 1940",
            "10-01-1990",
            "Nov. 2, 1978"
        ]
        for bd in bad_dates:
            date = parse_date(bd)
            self.assertIsNone(date)


if __name__ == "__main__":
    unittest.main()
