from django.db import models

# Create your models here.

class Employee(models.Model):
    name = models.CharField(max_length=255)
    department = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    jobTitle = models.CharField(max_length=255)
    profile_picture = models.ImageField(upload_to='photo/%Y/%m/%d', default='photo/default/default.jpg', verbose_name='Аватарка')

    def __str__(self):
        return f'{self.name} работает в компании {self.company} в отделе {self.department} в должности {self.jobTitle}'