from django.urls import path
from . import views

urlpatterns = [
    path('employees/<int:number>', views.Employees100APIView.as_view(), name = 'employees_count'),
    path('change_info/<int:emp_id>', views.EmployeeAPIView.as_view(), name = 'change_info')
]