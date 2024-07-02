import cv2
import numpy as np
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("image_path", help="Path to the image")
arg = parser.parse_args().image_path


def open_image(path):
    return cv2.imread(path)


def save_image(image, path):
    cv2.imwrite(path, image)


def show_image(image):
    cv2.imshow("image", image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()


def generate_black_and_white_number_matrix(image):
    grayscale = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # Create a black and white mat where only the blackest pixels are white
    _, blackandwhited = cv2.threshold(
        grayscale, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    contours, _ = cv2.findContours(
        blackandwhited, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    max_contour = max(contours, key=cv2.contourArea)

    mask_outer = np.zeros_like(blackandwhited)
    cv2.drawContours(mask_outer, [max_contour], -1, 255, -1)
    mask_outer_inv = cv2.bitwise_not(mask_outer)

    row_col_sums = cv2.bitwise_and(
        blackandwhited, blackandwhited, mask=mask_outer_inv)

    mask_inner = np.zeros_like(blackandwhited)
    cv2.drawContours(mask_inner, [max_contour], -1, 255, -1)

    kernel = np.ones((5, 5), np.uint8)
    shrunk_mask_inner = cv2.erode(mask_inner, kernel, iterations=5)

    inner_matrix = cv2.bitwise_and(
        blackandwhited, blackandwhited, mask=shrunk_mask_inner)

    final_matrix = cv2.bitwise_or(row_col_sums, inner_matrix)

    return final_matrix


def center_and_crop_with_margin(image, margin_size=10):
    coords = cv2.findNonZero(image)
    x, y, w, h = cv2.boundingRect(coords)

    center_x, center_y = x + w // 2, y + h // 2

    cropped_width = w + 2 * margin_size
    cropped_height = h + 2 * margin_size

    x_new = max(center_x - cropped_width // 2, 0)
    y_new = max(center_y - cropped_height // 2, 0)
    x_new_end = x_new + cropped_width
    y_new_end = y_new + cropped_height

    x_new_end = min(x_new_end, image.shape[1])
    y_new_end = min(y_new_end, image.shape[0])

    cropped_image = image[y_new:y_new_end, x_new:x_new_end]

    final_image = np.zeros((cropped_height, cropped_width), dtype=np.uint8)

    x_offset = (final_image.shape[1] - cropped_image.shape[1]) // 2
    y_offset = (final_image.shape[0] - cropped_image.shape[0]) // 2

    final_image[y_offset:y_offset+cropped_image.shape[0],
                x_offset:x_offset+cropped_image.shape[1]] = cropped_image

    return final_image


def resize_image(image, percentage_change):
    new_width = int(image.shape[1] * (100 + percentage_change) / 100)
    new_height = int(image.shape[0] * (100 + percentage_change) / 100)

    resized_image = cv2.resize(image, (new_width, new_height))

    return resized_image


image = open_image(arg)
bw_num_mtx = generate_black_and_white_number_matrix(image)
centered_cropped = center_and_crop_with_margin(bw_num_mtx)
# final = resize_image(centered_cropped, -50)
final = centered_cropped
show_image(final)
save_image(final, "output.png")
