#!/bin/bash

# SSH tunnel script to forward local serial port to remote device
# Usage: ./tunnel.sh

REMOTE_HOST="harris@10.0.0.228"
LOCAL_SERIAL="/tmp/serial0"
REMOTE_SERIAL="/dev/serial0"

echo "Creating SSH tunnel for serial port..."
echo "Local: $LOCAL_SERIAL -> Remote: $REMOTE_SERIAL"
echo "Press Ctrl+C to stop the tunnel"

# Create the tunnel using socat locally, with simple SSH command to cat to/from remote serial
socat PTY,link=$LOCAL_SERIAL,raw,echo=0 EXEC:"ssh $REMOTE_HOST 'exec 3<>$REMOTE_SERIAL; cat <&3 & cat >&3; kill %1'"