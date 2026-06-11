import sys

imie = "Oskar"
index = "57845"

python_path = sys.executable

print(f"Hello {imie} ({index}). This environment is using Python version {sys.version.split()[0]} at location {python_path}.")