import unittest
import datetime

from snl.fetch.helpers.date import full_month, abbr_month


class FullMonthTestCase(unittest.TestCase):

    def test_correctly_formatted(self):
        good_dates = [
            "January 17, 1940",
            "October 01, 1990",
            "November 2, 1978"
        ]
        for gd in good_dates:
            date = full_month(gd)
            self.assertIsInstance(date, datetime.date)

    def test_incorrectly_formatted(self):
        bad_dates = [
            None,
            "January 17 1940",
            "10-01-1990",
            "Nov. 2, 1978"
        ]
        for bd in bad_dates:
            date = full_month(bd)
            self.assertIsNone(date)


class AbbrShortMonthTestCase(unittest.TestCase):

    def test_correctly_formatted(self):
        good_dates = [
            "Jan 17, 1940",
            "Oct 01, 1990",
            "Nov 2, 1978"
        ]
        for gd in good_dates:
            date = abbr_month(gd)
            self.assertIsInstance(date, datetime.date)

    def test_incorrectly_formatted(self):
        bad_dates = [
            None,
            "January 17, 1940",
            "10-01-1990",
            "Nov. 2, 1978"
        ]
        for bd in bad_dates:
            date = abbr_month(bd)
            self.assertIsNone(date)

if __name__ == "__main__":
    unittest.main()
