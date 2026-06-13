#!/bin/bash

# Development environment setup for Sentinel AI

echo "Installing backend dependencies..."
python -m pip install --user -r requirements.txt

echo "Installing frontend dependencies..."
cd frontend && npm install

echo "Development environment setup complete."
