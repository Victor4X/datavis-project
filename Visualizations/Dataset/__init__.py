def get_data(filename):
    # This is a context manager that returns a file object from the data directory
    from importlib.resources import files
    return files("Visualizations.Dataset").joinpath('data/' + filename).open()
    