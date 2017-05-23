# Farm Crap App Pro (iOS)

The Farm Crap App Pro (FCA) is the open-source app that helps to reduce fertiliser use by calculating organic manure nutrients values.

FCA is based on [Ionic](http://ionicframework.com/) and any calculations have been based off of the codebase for the [Android version of FCA](https://github.com/fo-am/crapapppro).

### Getting Started

To get the project up and running in your development environment, follow these quick instructions below.

1. Install [Node.js](https://nodejs.org) and open up your command line utility

2. Install Ionic
```bash
npm install -g cordova ionic
```

3. Clone this project to your local machine
```bash
git clone https://github.com/Elixel/farm-crap-app-pro-app
```

4. Install required packages
```bash
cd clonedAppDirectory
npm install
```

5. Serve the project locally
```bash
# Do this before doing any cordova commands to generate WWW folder
ionic serve
```

6. Deploy to device
```bash
# Generate icons/splash
ionic cordova resources 
# Add iOS platform
ionic cordova platform add ios
# Build and run app
ionic cordova run ios
