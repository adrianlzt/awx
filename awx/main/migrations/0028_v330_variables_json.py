# -*- coding: utf-8 -*-
# Python
from __future__ import unicode_literals

# Psycopg2
from psycopg2.extensions import AsIs

# Django
from django.db import (
    connection,
    migrations,
    models,
    OperationalError,
    ProgrammingError
)
from django.conf import settings
import taggit.managers

# AWX
import awx.main.fields
from awx.main.models import Host


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0026_v330_emitted_events'),
    ]

    operations = [
        migrations.AlterField(
            model_name='inventory',
            name='variables',
            field=awx.main.fields.JSONBField(blank=True, default={}, help_text='Arbitrary JSON structure with variables.'),
        ),
        migrations.AlterField(
            model_name='host',
            name='variables',
            field=awx.main.fields.JSONBField(blank=True, default={}, help_text='Arbitrary JSON structure with variables.'),
        ),
        migrations.AlterField(
            model_name='group',
            name='variables',
            field=awx.main.fields.JSONBField(blank=True, default={}, help_text='Arbitrary JSON structure with variables.'),
        ),
    ]
