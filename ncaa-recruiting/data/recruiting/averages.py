import math
import json
import argparse


def haversine(start, end):
    # radius of earth in miles
    R = 3963.1676
    start_lat = math.radians(start["latitude"])
    start_cos = math.cos(start_lat)

    end_lat = math.radians(end["latitude"])
    end_cos = math.cos(end_lat)

    lat_delta = math.radians(end["latitude"] - start["latitude"])
    lat_delta_sin = math.sin(lat_delta/2)**2

    long_delta = math.radians(end["longitude"] - start["longitude"])
    long_delta_sin = math.sin(long_delta/2)**2

    a = lat_delta_sin + (start_cos * end_cos * long_delta_sin)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R*c


def get_distances(starts, end_longitude, end_latitude):
    end = {
        "longitude": end_longitude,
        "latitude": end_latitude
    }
    return [haversine(start, end) for start in starts]


def get_mean(distances):
    count = len(distances)
    return sum(distances) / count


def get_median(distances):
    distances = sorted(distances)
    count = len(distances)
    median = 0
    half = math.floor(count / 2)
    if count % 2 == 0:
        median = (distances[half-1] + distances[half]) / 2
    else:
        median = distances[half]
    return median


def get_mean_and_median(team):
    longitude = team.get("longitude")
    latitude = team.get("latitude")
    roster = team.get("roster")
    # need these things
    if longitude is None or latitude is None or roster is None:
        return
    distances = get_distances(roster, longitude, latitude)
    mean = get_mean(distances)
    median = get_median(distances)
    return mean, median


def set_averages(filename):
    with open(filename) as fp:
        data = json.load(fp)
    mean, median = get_mean_and_median(data)
    data["mean"] = mean
    data["median"] = median
    with open(filename, "w") as fp:
        json.dump(data, fp)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-filename", dest="filename",
                        help="college filename")
    args = parser.parse_args()

    set_averages(args.filename)
