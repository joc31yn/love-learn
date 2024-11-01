import subprocess
from datetime import datetime
import sys
import instaloader

def download_ig_profile(username):
    """
    downloads ig profile of username
    """
    ig = instaloader.Instaloader()

    # ig.login(user, pass) -> necessary if not already loggin in on ig in 
    # browser as will get error otherwise
    since = datetime(2024, 9, 1)
    ig_profile = instaloader.Profile.from_username(ig.context, username)
    for post in ig_profile.get_posts():
        date = post.date
        if date >= since:
            if post.typename == 'GraphImage':
                ig.download_post(post, target=ig_profile.username)
        else:
            break

download_ig_profile("uwcsclub")
