from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, Profile, Cart, Wishlist

@receiver(post_save, sender=User)
def create_user_related_records(sender, instance, created, **kwargs):
    """
    Automatically creates a Profile, Cart, and Wishlist whenever a User
    is created, regardless of registration source (API, Admin, CLI, OAuth).
    """
    if created:
        Profile.objects.get_or_create(user=instance)
        Cart.objects.get_or_create(user=instance)
        Wishlist.objects.get_or_create(user=instance)

@receiver(post_save, sender=User)
def save_user_related_records(sender, instance, **kwargs):
    """
    Ensures the user profile is synchronized when user instance is saved.
    """
    if hasattr(instance, 'profile'):
        instance.profile.save()
