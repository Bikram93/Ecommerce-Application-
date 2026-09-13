from django.core.management.base import BaseCommand
from api.models import User, Category, Product, ProductImage, Address

class Command(BaseCommand):
    help = 'Seeds essential demo data (Admin, Customer, Categories, Showcase Products)'

    def handle(self, *args, **options):
        self.stdout.write('Seeding initial demo data...')

        # 1. Create Superuser / Admin
        admin_user, created = User.objects.get_or_create(
            email='admin@example.com',
            defaults={
                'username': 'admin',
                'first_name': 'Store',
                'last_name': 'Admin',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('Created Admin: admin@example.com / admin123'))
        else:
            self.stdout.write('Admin user already exists.')

        # 2. Create Demo Customer
        customer, created = User.objects.get_or_create(
            email='customer@example.com',
            defaults={
                'username': 'customer',
                'first_name': 'John',
                'last_name': 'Doe',
                'is_staff': False,
                'is_superuser': False,
            }
        )
        if created:
            customer.set_password('customer123')
            customer.save()
            
            # Add demo address for customer
            Address.objects.create(
                user=customer,
                full_name='John Doe',
                phone='+1 (555) 234-5678',
                street_address='742 Evergreen Terrace',
                city='Springfield',
                state='IL',
                postal_code='62704',
                country='United States',
                is_default=True
            )
            self.stdout.write(self.style.SUCCESS('Created Customer: customer@example.com / customer123'))
        else:
            self.stdout.write('Customer user already exists.')

        # 3. Create Categories
        categories_data = [
            {
                'name': 'Electronics',
                'slug': 'electronics',
                'description': 'High-performance audio, computing and smart personal gear',
                'image_url': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=80'
            },
            {
                'name': 'Fashion & Apparel',
                'slug': 'fashion-apparel',
                'description': 'Modern minimalist streetwear and everyday lifestyle essentials',
                'image_url': 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80'
            },
            {
                'name': 'Home & Living',
                'slug': 'home-living',
                'description': 'Curated aesthetic homeware, workspace decor and modern accents',
                'image_url': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80'
            },
            {
                'name': 'Accessories',
                'slug': 'accessories',
                'description': 'Premium watches, sunglasses, leather bags and everyday carry',
                'image_url': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
            }
        ]

        cat_objs = {}
        for cdata in categories_data:
            cat, _ = Category.objects.get_or_create(slug=cdata['slug'], defaults=cdata)
            cat_objs[cdata['slug']] = cat
        self.stdout.write(self.style.SUCCESS(f'Created/Verified {len(cat_objs)} Categories.'))

        # 4. Create Showcase Products
        products_data = [
            {
                'category': cat_objs['electronics'],
                'title': 'Sony WH-1000XM5 Wireless Headphones',
                'slug': 'sony-wh-1000xm5-wireless-headphones',
                'description': 'Industry-leading noise cancelation with two processors, 8 microphones, and ultra-comfortable lightweight design with soft fit leather.',
                'price': 399.99,
                'discount_price': 349.99,
                'stock': 24,
                'sku': 'TECH-SONY-001',
                'rating': 4.9,
                'reviews_count': 142,
                'thumbnail_url': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
                'is_featured': True
            },
            {
                'category': cat_objs['electronics'],
                'title': 'Apple Watch Series 9 GPS 45mm',
                'slug': 'apple-watch-series-9-gps-45mm',
                'description': 'Smarter, brighter, and mightier. Double tap gesture, advanced health tracking, and all-day battery life in sleek aluminum finish.',
                'price': 429.00,
                'discount_price': 389.00,
                'stock': 16,
                'sku': 'TECH-AW9-002',
                'rating': 4.8,
                'reviews_count': 98,
                'thumbnail_url': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
                'is_featured': True
            },
            {
                'category': cat_objs['fashion-apparel'],
                'title': 'Minimalist Heavyweight French Terry Hoodie',
                'slug': 'minimalist-heavyweight-french-terry-hoodie',
                'description': '480 GSM dense combed cotton with clean dropped shoulders, double-layered hood, and pre-shrunk bespoke fit.',
                'price': 89.00,
                'discount_price': 69.00,
                'stock': 45,
                'sku': 'FASH-HOOD-003',
                'rating': 4.7,
                'reviews_count': 64,
                'thumbnail_url': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
                'is_featured': True
            },
            {
                'category': cat_objs['accessories'],
                'title': 'Heritage Chronograph Italian Leather Watch',
                'slug': 'heritage-chronograph-italian-leather-watch',
                'description': 'Precision Japanese quartz movement, sapphire-coated crystal dome, and hand-stitched vegetable-tanned Italian leather band.',
                'price': 199.00,
                'discount_price': 169.00,
                'stock': 12,
                'sku': 'ACC-WATCH-004',
                'rating': 4.6,
                'reviews_count': 38,
                'thumbnail_url': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
                'is_featured': False
            },
            {
                'category': cat_objs['home-living'],
                'title': 'Ceramic Pour-Over Coffee Brewer Set',
                'slug': 'ceramic-pour-over-coffee-brewer-set',
                'description': 'Handcrafted matte ceramic dripper with dual-wall borosilicate glass server. Engineered for optimal extraction and rich crema.',
                'price': 54.00,
                'discount_price': 44.00,
                'stock': 30,
                'sku': 'HOME-COFF-005',
                'rating': 4.9,
                'reviews_count': 51,
                'thumbnail_url': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
                'is_featured': True
            },
            {
                'category': cat_objs['accessories'],
                'title': 'Full-Grain Leather Minimalist Cardholder',
                'slug': 'full-grain-leather-minimalist-cardholder',
                'description': 'Ultra-slim profile holding up to 8 cards and folded cash. RFID blocking lining and burnished hand-waxed edges.',
                'price': 45.00,
                'discount_price': None,
                'stock': 50,
                'sku': 'ACC-WLLT-006',
                'rating': 4.7,
                'reviews_count': 29,
                'thumbnail_url': 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
                'is_featured': False
            }
        ]

        for pdata in products_data:
            prod, created = Product.objects.get_or_create(slug=pdata['slug'], defaults=pdata)
            if created:
                # Add primary image
                ProductImage.objects.create(
                    product=prod,
                    image_url=pdata['thumbnail_url'],
                    alt_text=pdata['title'],
                    is_primary=True
                )
        self.stdout.write(self.style.SUCCESS(f'Created/Verified {len(products_data)} Showcase Products.'))
        self.stdout.write(self.style.SUCCESS('Seed data completed successfully!'))
