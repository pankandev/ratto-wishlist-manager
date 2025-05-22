from rest_framework import serializers

from accounts.models import Account


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = [
            'id',
            'last_login',
            'is_superuser',
            'username',
            'email',
            'is_active'
        ]
