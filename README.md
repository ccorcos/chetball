# ChetBall

A spin-off of JezzBall.

## Getting Started

Install dependencies:

```sh
npm install
brew install imagemagick
npm install -g ios-deploy
```

Run development server on the web:

```sh
npm start
```

Build distribution HTML and JS.

```sh
npm run build
```

Deploy to web:

```sh
npm run build && npm run deploy
```

Build iOS app:

```sh
npm run build-ios
```

Build Android app:

```sh
npm run build-android
```

Update deps in Android Studio and [fix gradle](https://stackoverflow.com/questions/44105127/android-studio-3-0-flavor-dimension-issue/44105198#44105198).

```
sed -i'' -e $'s/android {/android {\\\n    flavorDimensions "default"\\\n/g' platforms/android/build.gradle
```

## Deploy to App Store

- Bump the version number config.xml
- Build the iOS app: `npm run build-ios`
- Click the "target" on the left and get the code-signing stuff to resolve.
- Change the build target to Generic iOS Device
- Product > Archive
- Upload to the App Store
- Open iTunes Connect
- Deploy to Test Flight
- Submit for Review

## Deploy to Google Play

- workin on it.

- Build > Generate Signed APK