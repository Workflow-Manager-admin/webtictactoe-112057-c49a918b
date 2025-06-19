#!/bin/bash
cd /home/kavia/workspace/code-generation/webtictactoe-112057-c49a918b/webtictactoe_web_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

