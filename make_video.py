
from moviepy import *
import numpy as np

img = ImageClip('assets/images2/bloomingHives background.png')

# Let's target 1920x1080
w, h = 1920, 1080
# The original image might be smaller or larger.
# We will resize it holding aspect ratio to cover 1.2x the screen so we can pan
img = img.with_position('center')

# Function to calculate position for pan effect
def make_frame(t):
    # duration is 10s. t goes from 0 to 10
    # we want to pan smoothly from 0 to 1 back to 0. Use sine wave
    progress = t / 10.0
    factor = np.sin(progress * np.pi) # 0 -> 1 -> 0
    # offset x and y
    dx = -50 * factor
    dy = -30 * factor
    return img.get_frame(t) # wait, making a frame this way is wrong in moviepy v2

# Easier way: use .transform() or just scale it
def effect(get_frame, t):
    frame = get_frame(t)
    return frame

# Let's just do it properly

