import json

from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import generics
from rest_framework.generics import get_object_or_404
from rest_framework.parsers import FileUploadParser, FormParser, MultiPartParser
from rest_framework.response import Response

from .models import Employee
from .serializers import EmployeeSerializer


# Create your views here.



class Employees100APIView(generics.ListAPIView):
    serializer_class = EmployeeSerializer

    def get_queryset(self):
        number = int(self.kwargs['number'])
        employees = Employee.objects.filter(pk__range = (number, number + 100))

        return employees

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if len(queryset) == 0:
            return HttpResponse(json.dumps({'detail' : 'Больше пользователей не существует'}, ensure_ascii=False), status=200)

        return self.list(request, *args, **kwargs)

class EmployeeAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = EmployeeSerializer
    parser_classes = [FormParser, MultiPartParser]

    def get_object(self):
        employee = get_object_or_404(Employee, pk = self.kwargs['emp_id'])
        return employee
