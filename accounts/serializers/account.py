import typing

from rest_framework import serializers

from accounts.models import Account


class AccountSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    # username = serializers.CharField(read_only=True)
    password = serializers.CharField(write_only=True, required=True)
    last_login = serializers.DateTimeField(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)

    class Meta:
        model = Account
        fields = [
            'id',
            'last_login',
            'password',
            'is_superuser',
            'email',
            'is_active'
        ]

    def validate(self, attrs: dict[str, typing.Any]):
        user_with_same_email = Account.objects.filter(email=attrs['email']).first()
        if user_with_same_email is not None:
            raise serializers.ValidationError({'email': 'already-exists'})
        return attrs

    def create(self, validated_data: dict[str, typing.Any]) -> Account:
        user = Account.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
        )
        user.set_password(validated_data['password'])
        user.save()

        return user
