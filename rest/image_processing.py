import numpy as np
import cv2


def order_points(points):
    # modified from https://www.pyimagesearch.com/2014/08/25/
    # 4-point-opencv-getperspective-transform-example/

    #point order: top-left, top-right, bottom-right, bottom-left
    point_sum = points.sum(axis=1)
    point_diff = np.diff(points, axis=1)

    return np.array([
        points[np.argmin(point_sum)],
        points[np.argmin(point_diff)],
        points[np.argmax(point_sum)],
        points[np.argmax(point_diff)],
    ], dtype='float32')


def points_to_numpy(points):
    return np.array(
        [[point['left'], point['top']] for point in points])


def distance(point_a, point_b):
    return np.linalg.norm(point_a - point_b)


def crop(input_file, output_file, points):
    points = np.array(points, dtype='float32')
    initial_rectangle = order_points(points)

    width = max(
        distance(points[0], points[1]),
        distance(points[2], points[3]),
    )

    height = max(
        distance(points[1], points[2]),
        distance(points[0], points[3]),
    )

    final_rectangle = np.array([
        [0, 0],
        [width, 0],
        [width, height],
        [0, height],
    ], dtype='float32')

    image = cv2.imread(input_file)
    transformation = cv2.getPerspectiveTransform(initial_rectangle, final_rectangle)
    cropped_image = cv2.warpPerspective(image, transformation, (width, height))
    cv2.imwrite(output_file, cropped_image)
