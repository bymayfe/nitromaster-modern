#!/bin/bash
# ==============================================================================
# NitroMaster - Clean Shutdown Script
# ==============================================================================
echo "🛑 Stopping NitroMaster Bridge..."
pkill -f "python3.*backend/bridge.py" || true
echo "✅ NitroMaster is completely closed and no longer running in the background."
