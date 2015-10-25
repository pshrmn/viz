import unittest
from recruiting.full_state import abbr_to_full


class FullStateTestCase(unittest.TestCase):

    def test_abbr_to_full(self):
        """
        abbr_to_full is essentially a lookup table that returns the arg
        when the key doesn't exist, so testing doesn't need to be
        very extensive
        """
        knowns_key_vals = [
            ("WI", "Wisconsin"),
            ("Tenn.", "Tennessee"),
            ("Ore.", "Oregon"),
            ("Ohio", "Ohio")
        ]

        for abbr, name in knowns_key_vals:
            self.assertEqual(name, abbr_to_full(abbr))

    def test_abbr_to_full_unknown(self):
        unknown_keys = [
            "Wisco",
            "New Y."
        ]
        for key in unknown_keys:
            self.assertEqual(key, abbr_to_full(key))

if __name__ == "__main__":
    unittest.main()
