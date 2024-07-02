import cv2
import pytesseract
import numpy as np


pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


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


def extract_numbers_to_txt(image_path, output_txt_path, n):
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    cell_height = gray.shape[0] // n
    cell_width = gray.shape[1] // n

    matrix = []

    for row in range(n):
        matrix_row = []
        for col in range(n):
            # For the top-left corner, append "-" directly
            if row == 0 and col == 0:
                matrix_row.append("-")
                continue

            # Crop the cell image
            cell = gray[row*cell_height:(row+1)*cell_height,
                        col*cell_width:(col+1)*cell_width]

            cell = center_and_crop_with_margin(cell, 5)

            # Use OCR to recognize the number in the cell
            number = pytesseract.image_to_string(
                cell, config='--psm 10 --oem 3 -c tessedit_char_whitelist=0123456789')
            number = number.strip()

            if not number or not number.isdigit():
                cv2.imshow("cell", cell)
                cv2.waitKey(0)
                cv2.destroyAllWindows()
                print(number)
                number = input("Enter the number: ")

            # Replace unrecognized cells with "0"
            matrix_row.append(number if number else "0")

        matrix.append(matrix_row)

     # Write the matrix to a text file
    with open(output_txt_path, 'w') as f:
        for row in matrix:
            f.write(' '.join(row) + '\n')


n = int(input("Enter the size of the matrix: "))
extract_numbers_to_txt("./output.png", "./output.txt", n)
