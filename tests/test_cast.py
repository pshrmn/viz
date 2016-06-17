import unittest

from snl.fetch.helpers.cast import repertory_cast_member


class CastMemberTestCase(unittest.TestCase):

    def test_matches_role_reg(self):
        descs = [
            ("Repertory Cast Members", True),
            ("Featured Players", False),
            ("Also Starring", False),
            ("Repertory Players", True),
            (None, False)
        ]
        for (desc, expected) in descs:
            self.assertEqual(repertory_cast_member(desc), expected)


if __name__ == "__main__":
    unittest.main()
