import factory
from faker import Faker

fake = Faker()

class UserFactory(factory.Factory):
    class Meta:
        model = dict
        
    _id = factory.Sequence(lambda n: f"user_{n}")
    email = factory.LazyAttribute(lambda o: fake.email())
    name = factory.LazyAttribute(lambda o: fake.name())
    role = "USER"
    is_active = True
