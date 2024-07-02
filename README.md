# Number Sums Solver Project

The Number Sums Solver Project offers a unique solution for fans of the Number Sums game, a puzzle similar to nonograms but with a numerical twist. In Number Sums, each row and column of a matrix begins with a specific number. Players must circle numbers within the matrix that add up to the total value indicated for that row or column, while eliminating numbers that do not contribute to the total. This project simplifies the solving process through two main components: a user-friendly web application and a sophisticated Python-based OCR tool for digit recognition from images.

## Web Application

The web application allows users to either manually input the size and values of a matrix or upload a text file containing the matrix data. To get started, follow these steps:

1. **Running the Web Server**: Use a server like the VS Code Live Server extension or Python's built-in HTTP server by running `python -m http.server` in the terminal.
2. **Using the Application**:
    - To manually input a matrix, enter the size of the matrix, click "Generate Matrix", fill out the matrix, and then click "Submit Matrix" to view the solution.
    - To use a text file, create a `.txt` file in the following format:
      ```
      - 29 17 2 27 14 33 9
      12 2 2 7 8 9 3 5
      ...
      ```
      Then, upload this file through the web interface to get the solution.

## Python OCR Tool

For users who wish to extract matrix data from images, the project includes a Python program that utilizes OCR technology. Here's how to set it up and use it:

1. **Setting Up**:
    - Create a virtual environment: `python -m venv venv`
    - Activate the virtual environment:
      - Windows: `venv\Scripts\activate`
      - macOS/Linux: `source venv/bin/activate`
    - Install dependencies: `pip install -r requirements.txt`

2. **Preparing the Image**:
    - Take a screenshot of the game and crop it so only the table is visible. An example image is shown below:

    ![Example Game Table](images/example_table.jpeg)

3. **Running the Program**:
    - Transfer the cropped image to your computer.
    - Run `python main.py <image path>` to process the image. A popup window will display the generated image; close it by pressing any key.
    - An `output.png` file will be generated. Next, run `python extract_num.py`. This script will ask for the size of the matrix and attempt to OCR the numbers.
    - If a number cannot be recognized, it will be displayed in an OpenCV popup. Recognize the number, press any key to close the popup, and then enter the number in the terminal.
    - Once all numbers are entered, the program generates an `output.txt` file that can be uploaded to the website.

**Note**: The Python program requires the Tesseract executable to be installed on the user's computer. Ensure the path to `tesseract.exe` is correctly set in the `extract_num.py` file.

## Requirements

- Python 3.x
- Tesseract OCR
- Web server (VS Code Live Server, Python HTTP server, etc.)

## Example Text File

Here is an example of a text file format for matrix input:

```txt
- 29 17 2 27 14 33 9
12 2 2 7 8 9 3 5
20 4 5 2 4 9 9 3
12 6 1 3 2 3 6 4
29 6 3 5 7 8 8 4
25 4 9 8 6 3 8 1
20 7 5 2 6 5 7 1
13 1 3 9 4 7 8 5
```