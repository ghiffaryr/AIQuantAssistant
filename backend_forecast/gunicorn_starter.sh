#!/bin/sh
gunicorn --chdir app main:app -b 0.0.0.0:8000 --timeout 1000