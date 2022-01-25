#! /usr/bin/env bash

# Let the DB start
echo Starting backend_pre_start.py ...
python /app/app/backend_pre_start.py
echo backend_pre_start.py done.

# Run migrations
echo Starting alembic upgrade head ...
alembic upgrade head
echo alembic upgrade head done

# Create initial data in DB
echo Starting initial_data.py
python /app/app/initial_data.py
echo initial_data.py data

echo Done with prestart.sh