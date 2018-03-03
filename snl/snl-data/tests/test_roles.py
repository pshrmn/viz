import unittest

from snl.fetch.helpers.role import cast_member, not_alternate, only_cast, credited


class CastMemberTestCase(unittest.TestCase):

    def test_matches_role_reg(self):
        descs = [
            ("Various", True),
            ("Weekend Update Anchor", True),
            ("One / Two / Three", True),
            ("Host / Various", True),
            ("Bee", True),
            ("One, Two, Three", False),
            ("Various (uncredited)", False),
            (None, False)
        ]
        for (desc, expected) in descs:
            self.assertEqual(cast_member(desc), expected)


class NotAlternateTestCase(unittest.TestCase):

    def test_matches_not_alternate(self):
        descs = [
            ("Various / Samuel L. Jackson", True),
            ("Weekend Update Anchor", True),
            ("Host / Various", False),
            ("Musical Guest", False)
        ]
        for (desc, expected) in descs:
            self.assertEqual(not_alternate(desc), expected)


class CreditedTestCase(unittest.TestCase):

    def test_matches_uncredited_reg(self):
        descs = [
            ("Bill Nye (uncredited)", False),
            ("Various", True),
            ("Uncredited", True),
            ("Neil Degrasse Tyson (Uncredited)", True)
        ]
        for (desc, expected) in descs:
            self.assertEqual(credited(desc), expected)


class OnlyCastTestCase(unittest.TestCase):

    def test_matches_both_conditions(self):
        descs = [
            ("Various", True),  # cast member
            ("Weekend Update Anchor", True),  # cast member
            ("One / Two / Three", True),  # cast member
            ("Host / Various", False),  # host
            ("One, Two, Three", False),  # nothing
            (None, False),  # nothing
            ("Various / Samuel L. Jackson", True),  # cast member
            ("Musical Guest", False),  # musical guest
            ("Musical Guest / Various", False)  # musical guest
        ]
        for (desc, expected) in descs:
            self.assertEqual(only_cast(desc), expected)

if __name__ == "__main__":
    unittest.main()
