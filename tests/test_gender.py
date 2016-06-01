import unittest

from snl.fetch.helpers.gender import infer_gender


class InferGenderTestCase(unittest.TestCase):

    def test_identify_female(self):
        more_female_descriptions = [
            "She",
            "she",
            "Her",
            "her",
            "She won the award",
            "She was sure that he was her favorite",
            "Her name is Wilma"
        ]
        for d in more_female_descriptions:
            self.assertEqual(infer_gender(d), "female")

    def test_identify_male(self):
        more_male_descriptions = [
            "He",
            "he",
            "His",
            "his",
            "Him",
            "him",
            "He was born in Macedonia",
            "His mother was his hero for how she raised him"
        ]
        for d in more_male_descriptions:
            self.assertEqual(infer_gender(d), "male")

    def test_unsure(self):
        unsure_descriptions = [
            "he appears the same number of times as she",
            "neither appear in this sentence",
            None
        ]
        for d in unsure_descriptions:
            self.assertIsNone(infer_gender(d))


if __name__ == "__main__":
    unittest.main()
