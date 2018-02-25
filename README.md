# node-cec-fix-tv
node script for raspberry pi to fix wonky Samsung hdmi cec command


after checkout and npm install to run as service

    npm install forever -g
    npm install forever-service -g
    
    forever-service install node-cec-fix-tv
    service node-cec-fix-tv start
    
