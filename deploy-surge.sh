# Build reactjs app with production mode 
npm run build

# Move to build folder
cd build

# Clone index.html into 200.html
cp index.html 200.html

# Start deploying via Surge
# The command means deploy current folder to domain app-name.surge.sh
surge . tutorsfinder.surge.sh

cd ..